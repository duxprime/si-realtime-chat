import { isNonEmptyStr } from './string.helpers';

describe('String helpers', () => {
    describe('exists()', () => {
        it('should consider null, undefined, and "" to be empty', () => {
            const emptyValues = [
                null,
                undefined,
                ''
            ] as const;

            emptyValues.forEach(val => expect(isNonEmptyStr(val)).toBe(false));
        });

        it('should consider strings with content to be non-empty', () => {            
            expect(isNonEmptyStr('foo')).toBe(true);
        });
    });
});