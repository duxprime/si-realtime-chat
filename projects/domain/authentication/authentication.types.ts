import type { InjectionKey } from 'vue';
import { type AuthenticationService } from './authentication.service';

/**
 * Enumeration of keys used to set auth data in session storage.
 */
export enum AuthStorage {
    User = 'si-user-data'
}

export interface AuthenticationReqDto {
    user: string;
}

export interface AuthenticationRespDto{
    user: string;
}

export const AuthServiceSymbol = Symbol.for('AuthenticationService') as InjectionKey<AuthenticationService>