export function isNonEmptyStr(str?: string | null): str is string {
    return typeof str === 'string' && str.length > 0;
}