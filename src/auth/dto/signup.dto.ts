import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'fHcVg@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'john-doe' })
  nickname: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatarUrl: string;
}
