import { User } from '../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../domain/interfaces/user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class CreateUserUseCase {
    private repo;
    constructor(repo: UserRepositoryInterface);
    execute(dto: CreateUserDto): Promise<User>;
}
