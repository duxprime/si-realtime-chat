/**
 * Signature for the browser implementation of the HTTP `fetch()` function.
 */
export type IFetch = Window['fetch'];

export enum HttpVerb {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE'
}

export enum HttpResponse {
    Raw = 'raw',
    Text = 'text',
    Json = 'json',
    Blob = 'blob',
    ArrayBuffer = 'array-buffer'
}