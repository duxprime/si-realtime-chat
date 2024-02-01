import { Injectable } from 'injection-js';
import { Subject } from 'rxjs';
import 'reflect-metadata';
import { exists } from 'utils/functions';
import { HttpService } from 'utils/services/http';
import { SessionStorageService } from 'utils/services/storage';
import { type AuthenticationReqDto, type AuthenticationRespDto, AuthStorage } from './authentication.types';
import { UserEntity } from '../user';

const baseUrl = '/signin';

@Injectable()
export class AuthenticationService {
    private _user?: UserEntity;

    public get user(){
        return this._user;
    }

    public get authenticated(){
        return exists(this._user);
    }

    private readonly authenticationSubject = new Subject<UserEntity>();
    /**
     * A stream that emits each time the current user has authenticated.
     */
    public readonly authenticated$ = this.authenticationSubject.asObservable();

    constructor(
        private readonly http: HttpService,
        private readonly sessionStorage: SessionStorageService
    ){
        // support persisting logins by recalling previous session ID
        const persistedDto = this.getPersistedUser();
        if(persistedDto) {
            this._user = new UserEntity(persistedDto.user);
            this.authenticationSubject.next(this._user);
        }

    }

    public async signIn(userName: string) {
        if(this._user) {
            this.authenticationSubject.next(this._user);
            return this._user;
        }

        const user = await this.http.post<AuthenticationRespDto, AuthenticationReqDto>(baseUrl, {
            user: userName
        });

        // this.setPersistedUser(user);
        this._user = new UserEntity(user.user);
        this.authenticationSubject.next(this._user);

        return user;
    }

    public signOut(){
        if(!this._user){
            return;
        }

        this.setPersistedUser(null);
        this._user = undefined;
    }

    private getPersistedUser(){
       return this.sessionStorage.get<AuthenticationRespDto>(AuthStorage.User);
    }

    private setPersistedUser(user: AuthenticationRespDto | null){
        if(!user) {
            this.sessionStorage.remove(AuthStorage.User);
            return;
        }

        this.sessionStorage.set(AuthStorage.User, user);
    }
}