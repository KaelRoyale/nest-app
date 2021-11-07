import { ApiProperty } from "@nestjs/swagger";
import { string } from "joi";

export class LoginUserDto {
    @ApiProperty({
        type: string,
        description: 'User name string'
      })
    username: string;
    @ApiProperty({
        type: string,
        description: 'User name string'
      })
    password: string;
}