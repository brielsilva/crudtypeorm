import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'CPF of the user',
    example: '12345678909',
  })
  cpf: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123!',
    type: String,
    format: 'password',
  })
  password: string;
}
