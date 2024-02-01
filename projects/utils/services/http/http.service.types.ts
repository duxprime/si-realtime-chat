import { HttpVerb, type IFetch } from '../../types/http.types';
import { InjectionToken } from 'injection-js';


export interface HttpReqConfig {
    method: HttpVerb;
    protocol: 'http' | 'https';
    body?: BodyInit;
    /**
     * Whether to prefix a provided path with the configured base URL (if any).
     */
    includeBase: boolean;
}

export const HTTP_FETCH_TOKEN = new InjectionToken<IFetch>('HTTP_FETCH_TOKEN');
export const URL_BASE_TOKEN = new InjectionToken<string>('URL_BASE_TOKEN');