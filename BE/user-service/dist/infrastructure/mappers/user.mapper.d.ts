import { User } from '../../domain/entities/user.entity';
export declare class UserMapper {
    static toDomain(raw: any): User | null;
    static toResponse(user: User): {
        id: string;
        name: string;
        email: string;
        createdAt: Date;
    };
}
