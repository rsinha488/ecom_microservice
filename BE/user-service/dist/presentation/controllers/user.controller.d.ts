import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { GetUserUseCase } from '../../application/use-cases/get-user.usecase';
import { ListUsersUseCase } from '../../application/use-cases/list-users.usecase';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
export declare class UserController {
    private readonly createUser;
    private readonly updateUser;
    private readonly getUser;
    private readonly listUsers;
    constructor(createUser: CreateUserUseCase, updateUser: UpdateUserUseCase, getUser: GetUserUseCase, listUsers: ListUsersUseCase);
    create(body: CreateUserDto): Promise<import("../../domain/entities/user.entity").User>;
    update(id: string, body: UpdateUserDto): Promise<import("../../domain/entities/user.entity").User>;
    get(id: string): Promise<import("../../domain/entities/user.entity").User>;
    list(): Promise<import("../../domain/entities/user.entity").User[]>;
}
