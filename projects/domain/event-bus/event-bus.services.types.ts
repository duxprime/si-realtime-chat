
import type { InjectionKey } from 'vue';
import { EventBusService } from './event-bus.service';

export const EventBusServiceSymbol = Symbol.for(EventBusService.name) as InjectionKey<EventBusService>;

interface SocketEvent {
    kind: 'signIn' | 'message';
    user: string;
}

export interface SignInEvent extends SocketEvent {
    kind: 'signIn';
}

export interface MessageEvent extends SocketEvent {
    kind: 'message';
    index: number;
    message: string;
}

export type AppEvent = SignInEvent | MessageEvent;

export function isMessageEvent(event: AppEvent): event is MessageEvent {
    return event.kind === 'message';
}

export function isSignInEvent(event: AppEvent): event is SignInEvent {
    return event.kind === 'signIn';
}