import type { InjectionKey } from 'vue';
import { UserService } from './user.service';

export const UserServiceSymbol = Symbol.for(UserService.name) as InjectionKey<UserService>;

export interface UserCollectionDto {
    users: string[];
}