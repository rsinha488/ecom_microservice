"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_config_1 = __importDefault(require("./config/user.config"));
const mongoose_1 = require("@nestjs/mongoose");
const redis_module_1 = require("./infrastructure/redis/redis.module");
const user_controller_1 = require("./presentation/controllers/user.controller");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const user_mapper_1 = require("./infrastructure/mappers/user.mapper");
const user_domain_service_1 = require("./domain/services/user-domain.service");
const create_user_usecase_1 = require("./application/use-cases/create-user.usecase");
const update_user_usecase_1 = require("./application/use-cases/update-user.usecase");
const get_user_usecase_1 = require("./application/use-cases/get-user.usecase");
const list_users_usecase_1 = require("./application/use-cases/list-users.usecase");
const user_schema_1 = require("./infrastructure/database/user.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [user_config_1.default] }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.UserModel.name, schema: user_schema_1.UserSchema }]),
            redis_module_1.RedisModule,
        ],
        controllers: [user_controller_1.UserController],
        providers: [
            {
                provide: "USER_REPOSITORY",
                useClass: user_repository_1.UserRepository,
            },
            user_mapper_1.UserMapper,
            user_domain_service_1.UserDomainService,
            create_user_usecase_1.CreateUserUseCase,
            update_user_usecase_1.UpdateUserUseCase,
            get_user_usecase_1.GetUserUseCase,
            list_users_usecase_1.ListUsersUseCase,
        ], exports: [create_user_usecase_1.CreateUserUseCase, get_user_usecase_1.GetUserUseCase, list_users_usecase_1.ListUsersUseCase],
    })
], AppModule);
