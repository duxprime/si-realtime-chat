/**
 * Represents a user in the chat system.
 */
export class UserEntity {
    constructor(public readonly name: string){}

    /**
     * Perform a case-insensitive comparison of this user 
     * to another for lexographical sorting.
     */
    public compare(other: UserEntity) {
        const name = this.name.toLowerCase();
        const otherName = other.name.toLowerCase();

        if(name === otherName){
            return 0;
        }

        return name > otherName ? 1 : -1;
    }
}