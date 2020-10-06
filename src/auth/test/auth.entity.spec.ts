import * as bcrypt from 'bcryptjs';
import { Auth } from '../auth.entity';

describe('VALIDATES USER PASSWORD', () => {
  let user;

  beforeEach(() => {
    user = new Auth();
    user.username = 'testuser';
    user.password = 'testpassword';
    user.salt = 'testsalt';
    bcrypt.hash = jest.fn();
  });

  //! Logic of auth is, when we provide some password, it will get mixed
  //! up with salt and it should be equal to the already saved password in
  //! user.password

  it('returns validation to be true', async () => {
    bcrypt.hash.mockResolvedValue('testpassword');
    const result = await user.validatePassword(12345);
    expect(result).toBe(true);
  });

  it('returns validation to be falsy', async () => {
    bcrypt.hash.mockResolvedValue('nottestpassword');
    const result = await user.validatePassword(12345);
    expect(result).toBe(false);
  });
});
