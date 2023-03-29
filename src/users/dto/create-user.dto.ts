import * as bcrypt from 'bcrypt';

export class CreateUserDto {
    id: string
    email: string
    password: string
    token: string
    firstName: string
    lastName: string
    imageInBase64: string
}
