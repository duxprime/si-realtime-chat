
import type { InjectionKey } from 'vue';
import { SessionStorageService } from './session-storage.service';

export const SessionStorageServiceSymbol = Symbol.for(SessionStorageService.name) as InjectionKey<SessionStorageService>;