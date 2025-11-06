import { Model } from 'mongoose';
import { UserDocument } from '../database/user.schema';
import { User } from '../../domain/entities/user.entity';
export declare class UserRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(user: User): Promise<User>;
    update(id: string, patch: Partial<User>): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(filter?: any): Promise<User[]>;
}
