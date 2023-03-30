import * as bcrypt from 'bcrypt';

export class CreateUserDto {
    taskOne: {
        email: string | null
        password: string | null
        token: string | null
    }
    taskThree: {
        id: string | null
        hash: string | null
        imageRouter: string | null
    }
}
