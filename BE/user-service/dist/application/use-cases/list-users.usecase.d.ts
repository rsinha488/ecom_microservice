import { UserRepository } from '../../infrastructure/repositories/user.repository';
export declare class ListUsersUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(): Promise<import("../../domain/entities/user.entity").User[]>;
}
