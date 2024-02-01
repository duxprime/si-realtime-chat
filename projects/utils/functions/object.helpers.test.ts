import { exists } from './object.helpers';

describe('Object helpers', () => {
    describe('exists()', () => {
        it('should not consider null and undefined to exist', () => {
            const nonExistantValues = [
                null,
                undefined
            ] as const;

            nonExistantValues.forEach(val => expect(exists(val)).toBe(false));
        });

        it('should consider non-null and non-undefined objects to exist', () => {
            
            const existantValues = [
                -1,
                0,
                1,
                {},
                '',
                'foo',
                [],
                ['bar'],
                new Date(),
                new (class TestClass{}),
                NaN
            ] as const;

            existantValues.forEach(val => expect(exists(val)).toBe(true));
        });
    });
});