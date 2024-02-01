import { Injectable } from 'injection-js';
import 'reflect-metadata';

@Injectable()
export class SessionStorageService {
    private get storage() {
        return window.sessionStorage;
    }

    public get<T>(key: string){
        try {
            const serialized = this.storage.getItem(key);
            if(serialized){
                return JSON.parse(serialized) as T;
            }
        }
        catch {
            return undefined;
        }
    }

    public set<T extends object>(key: string, value: T){
        this.storage.setItem(key, JSON.stringify(value));
    }

    public remove(key: string) {
        this.storage.removeItem(key);
    }
}