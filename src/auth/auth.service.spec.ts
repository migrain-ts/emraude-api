import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService - signUp', () => {
  let authService: any;
  let userModel: any;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    authService = {
      userModel,
      signUp: async function (user) {
        const existingUser = await this.userModel.findOne({
          $or: [{ email: user.email }, { nickname: user.nickname }],
        });
        if (existingUser) {
          throw new ConflictException(
            existingUser.nickname
              ? 'This nickname is already in use'
              : 'This email is already in use',
          );
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const createdUser = await this.userModel.create({
          ...user,
          hashedPassword,
        });

        await createdUser.save();
        return 'User created successfully';
      },
    };
  });

  it('should throw ConflictException if user with email or nickname exists', async () => {
    userModel.findOne.mockResolvedValue({ nickname: 'existingNick' });

    await expect(
      authService.signUp({
        email: 'test@test.com',
        password: 'pass',
        nickname: 'existingNick',
        avatarUrl: '',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create user successfully if not exists', async () => {
    userModel.findOne.mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue(true);
    userModel.create.mockReturnValue({ save: saveMock });

    const result = await authService.signUp({
      email: 'new@test.com',
      password: 'pass123',
      nickname: 'newUser',
      avatarUrl: 'avatar.png',
    });

    expect(userModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: 'new@test.com' }, { nickname: 'newUser' }],
    });

    expect(userModel.create).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBe('User created successfully');
  });
});
