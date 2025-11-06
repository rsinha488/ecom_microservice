import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../../domain/repository/user.repository';
export declare class UpdateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(id: string, payload: UpdateUserDto): Promise<import("../../domain/entities/user.entity").User>;
}
