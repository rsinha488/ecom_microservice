import { UserRepository } from '../../domain/repository/user.repository';
export declare class GetUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(id: string): Promise<import("../../domain/entities/user.entity").User>;
}
