import { Injectable } from 'injection-js';
import { HttpService } from 'utils/services/http';
import { ref } from 'vue';
import type { MessageReqDto, MessageDto, MessageRespDto, MessageHistoryDto } from './message.service.types';
import { AuthenticationService } from '../authentication';
import { merge, Subject, type Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventBusService, isMessageEvent } from '../event-bus';
import 'reflect-metadata';

const baseUrl = '/messages';

@Injectable()
export class MessageService {
    public readonly messages = ref<MessageDto[]>([]);
    private readonly messageSubject = new Subject<MessageDto>();
    private readonly messageEvent$: Observable<MessageDto>;
    public readonly message$:Observable<MessageDto>;

    constructor(
        private readonly http: HttpService, 
        private readonly auth: AuthenticationService,
        private readonly eventBus: EventBusService
    ){
        this.messageEvent$ =  this.eventBus.event$.pipe(
            filter(isMessageEvent),
            map(({index, user, message}) => ({
                index,
                user,
                message
            }))
        );
        this.message$ = merge(
            this.messageSubject.asObservable(),
            this.messageEvent$
        );
        this.message$.subscribe(message => {
            const { index } = message;
            // ensure messages received out of sequence
            // are displayed in the correct order
            this.messages.value[index] = message;
        });
    }

    /**
     * Hydrate the service with any existing messages.
     */
    public async init(){
        this.messages.value = await this.getMessages();
    }

    /**
     * Returns a list of all the messages that have been sent, ordered by their index.
     */
    public async getMessages(){
        const { messages } = await this.http.get<MessageHistoryDto>(baseUrl);
        return messages;
    }

    /**
     * Send a message to all signed in users (including yourself).
     */
    public async sendMessage(message: string){
        const { user } = this.auth;
        if(!user){
            throw new Error('Could not send message. User is not authenticated.');
        }

        const payload:MessageReqDto = {
            user: user.name,
            message,

        }
        const { index } = await this.http.post<MessageRespDto, MessageReqDto>(baseUrl, payload);
        const result: MessageDto = {
            ...payload,
            index
        };

        return result;
    }
}