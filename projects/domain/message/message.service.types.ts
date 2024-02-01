import type { InjectionKey } from 'vue';
import { MessageService } from './message.service';

export const MessageServiceSymbol = Symbol.for(MessageService.name) as InjectionKey<MessageService>;

export interface MessageReqDto  {
    user: string;
    message: string;
}

export interface MessageRespDto {
    index: number;
}

export type MessageDto = MessageReqDto & MessageRespDto;

export interface MessageHistoryDto {
    messages: MessageDto[];
}