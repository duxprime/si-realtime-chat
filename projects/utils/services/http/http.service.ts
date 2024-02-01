import { Injectable, Inject, Optional } from 'injection-js';
import { Subject } from 'rxjs';
import { type IFetch, HttpVerb, HttpResponse } from '../../types/http.types';
import { type HttpReqConfig, HTTP_FETCH_TOKEN, URL_BASE_TOKEN } from './http.service.types';
import { exists, isNonEmptyStr } from '../../functions';
import 'reflect-metadata';

const defaultConfig: HttpReqConfig = {
    method: HttpVerb.Get,
    includeBase: true,
    protocol: 'http'
};

@Injectable()
export class HttpService {
    private readonly sessionExpiredSubject = new Subject<void>();
    public readonly sessionExpired$ = this.sessionExpiredSubject.asObservable();

    private readonly requestErrorSubject = new Subject<Error>();
    public readonly requestErrord$ = this.requestErrorSubject.asObservable();

    private readonly fetch: IFetch;

    constructor(
        // @ts-ignore
        @Inject(HTTP_FETCH_TOKEN) readonly fetchFn: IFetch, 
        // @ts-ignore
        @Inject(URL_BASE_TOKEN) @Optional() readonly urlBase?: string
    ){
        // maintain original fetch `this` binding by calling from wrapper function 
        // rather than assigning to the class instance directly
        this.fetch = (...args: Parameters<IFetch>) => {
            const [, config] = args;
            if(config?.body){
                config.body = JSON.stringify(config.body);
            }

            return fetchFn(...args);
        }
    }

    public get<T>(url: string) {
        return this.request<T>(url, HttpResponse.Json, {
            method: HttpVerb.Get,
        });
    }

    public post<T, Body extends object = object>(url: string, body: Body) {
        return this.request<T>(url, HttpResponse.Json, {
            method: HttpVerb.Post,
            body: body as BodyInit
        });
    }

    public async request(url: string, parseAs: HttpResponse.Raw, config?: Partial<HttpReqConfig>): Promise<Response>;
    public async request(url: string, parseAs: HttpResponse.Text, config?: Partial<HttpReqConfig>): Promise<string>;
    public async request<T>(url: string, parseAs: HttpResponse.Json, config?: Partial<HttpReqConfig>): Promise<T>;
    public async request(url: string, parseAs: HttpResponse.Blob, config?: Partial<HttpReqConfig>): Promise<Blob>;
    public async request(url: string, parseAs: HttpResponse.ArrayBuffer, config?: Partial<HttpReqConfig>): Promise<ArrayBuffer>;
    public async request<T>(url: string, parseAs = HttpResponse.Json, config?:Partial<HttpReqConfig>) {
        const {method, body, includeBase, protocol } = normalizeConfig(config);
        const headers = createHeaders(parseAs);
        url = this.normalizeUrl(url, includeBase, protocol);

        const response = await this.fetch(url, {
            method,
            body,
            headers
        });

        if(!response.ok) {
            this.handleBadResponse(response);
        }

       return deserialize<T>(response, parseAs);
    }

    private async handleBadResponse(resp: Response){
        const { status } = resp;

        // if the API supported auth tokens, we'd want to account
        // for the session expiring to, e.g., redirect to login
        if(status === 401) {
            this.sessionExpiredSubject.next();
            return;
        }

        // fetch requests only throw on network errors,
        // so we should throw on HTTP 400 and 500 statuses
        // to allow calling code to try/catch
        const errorText = await resp.clone().text();
        const requestErr = new Error(errorText);

        this.requestErrorSubject.next(requestErr);
        throw requestErr;
    }

    /**
     * Normalizes a possibly relative URL into a full-qualified one.
     * @param includeBase Preprends a provided base URL if `true`.
     */
    private normalizeUrl(url: string, includeBase = true, protocol: HttpReqConfig['protocol'] = 'http', delimiter = '/'){
        const urlParts = url.split(delimiter).filter(isNonEmptyStr);
        /**
         * Create a URL without a leading delimiter.
         */
        let normalizedUrl = urlParts.join(delimiter);
    
        if(includeBase && this.urlBase) {
            normalizedUrl = `${this.urlBase}${delimiter}${normalizedUrl}`;
        }

        const protocolPrefix = `${protocol}://`;
        if(!normalizedUrl.startsWith(protocolPrefix)){
            normalizedUrl = protocolPrefix + normalizedUrl;
        }
    
        return normalizedUrl;
    }
}

function normalizeConfig(config: Partial<HttpReqConfig> = {}): HttpReqConfig  {
    const normalizedConfig = {
        ...defaultConfig,
        ...config
    }

    if(normalizedConfig.method === HttpVerb.Get && exists(normalizedConfig.body)) {
        throw new TypeError('Cannot specify a body on an HTTP GET request.');
    }

    return normalizedConfig;
}

function createHeaders(parseAs = HttpResponse.Json) {
    const headers = new Headers();
    const contentTypeMappings: Partial<Record<HttpResponse, string>> = {
        [HttpResponse.Json] : 'application/json',
        [HttpResponse.Text] : 'text/plain',
        [HttpResponse.Blob] : 'application/octet-stream',
        [HttpResponse.ArrayBuffer] : 'application/octet-stream'
    }
    const contentType =  contentTypeMappings[parseAs] ?? 'text/plain';

    headers.set('Content-Type', contentType); 

    return headers;
}

async function deserialize<T>(resp: Response, parseAs = HttpResponse.Json) {
    // clone the response in case it needs to be read again later
    const respClone = resp;

    try {
        switch(parseAs){
            case HttpResponse.Text:
                return respClone.text();
            case HttpResponse.Json:
                return respClone.json() as Promise<T>;
            case HttpResponse.ArrayBuffer:
                return respClone.arrayBuffer();
            case HttpResponse.Blob:
                return respClone.blob();
            case HttpResponse.Raw:
            default:
                return resp;
        }
    }
    // parsing failed; just return the raw response
    catch{
        return resp;
    }
}

