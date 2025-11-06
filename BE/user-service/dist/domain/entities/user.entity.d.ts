export declare class User {
    readonly id: string;
    name: string;
    email: string;
    passwordHash?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(id: string, name: string, email: string, passwordHash?: string, createdAt?: Date, updatedAt?: Date);
}
