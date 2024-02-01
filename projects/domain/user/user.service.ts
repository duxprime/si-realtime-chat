import { ref } from 'vue';
import { type Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Injectable } from 'injection-js';
import { EventBusService, isSignInEvent } from '../event-bus';
import { HttpService } from 'utils/services/http';
import type { UserCollectionDto } from './user.types';
import { UserEntity } from './user.entity';
import 'reflect-metadata';

const baseUrl = '/users';

@Injectable()
export class UserService {
    public readonly users = ref<UserEntity[]>([]);
    public readonly signInEvent$: Observable<UserEntity>; 

    constructor(
        private readonly http: HttpService, 
        private readonly eventBus: EventBusService,
    ){
        this.signInEvent$ = this.eventBus.event$.pipe(
            filter(isSignInEvent),
            map(({ user }) => new UserEntity(user))
        );
        this.signInEvent$.subscribe(user => {
            this.users.value.push(user);
            this.users.value.sort((a, b) => a.compare(b));
        });
    }

    /**
     * Hydrate the service with a list of logged in users.
     */
    public async init(){
        this.users.value = await this.getUsers();
    }
    
    /**
     * Returns a list of users that have signed in, in alphabetical order.
     */
    public async getUsers(){
        const userCollection = await this.http.get<UserCollectionDto>(baseUrl);
        return userCollection.users
            .map(name => new UserEntity(name))
            .sort((a, b) => a.compare(b));
    }
}