
import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";


export class CreateUserDto {
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    createdAt: string = new Date().toISOString();
    @ApiProperty()
    isLocked: boolean = false;
}


export class UpdateUserInput extends PartialType(
  OmitType(CreateUserDto, ['password', 'createdAt'] as const),
) {}