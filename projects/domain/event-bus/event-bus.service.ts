import { Injectable, Inject, Optional } from 'injection-js';
import { Subject } from 'rxjs';
import type { AppEvent } from './event-bus.services.types';
import { URL_BASE_TOKEN } from 'utils/services/http';
import 'reflect-metadata';

@Injectable()
export class EventBusService {
    private readonly socket: WebSocket;

    private readonly eventSubject = new Subject<AppEvent>();
    public readonly event$ = this.eventSubject.asObservable();

    constructor(
        // @ts-ignore
        @Inject(URL_BASE_TOKEN) @Optional() readonly urlBase?: string
    ){
        this.socket = new WebSocket(`ws://${urlBase}/ws`);
        this.setUpSocket();
    }

    private setUpSocket(){
        this.socket.onmessage = msg => {
            try {
                const data = JSON.parse(msg.data) as AppEvent;
                this.eventSubject.next(data);
            }
            catch (e){
                this.eventSubject.error(e);
            }
        };

        this.socket.onerror = e => {
            this.eventSubject.error(e);
        }

        this.socket.onclose = () => {
            this.eventSubject.complete();
        };
    }
}