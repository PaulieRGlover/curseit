import { api } from '../client';
import {
  ACCESS_TOKEN_REGEXP,
  ID_TOKEN_COOKIE_REGEXP,
  REFRESH_TOKEN_COOKIE_REGEXP,
} from '../constants';
import { MockUserData } from '../helpers';

const MOCK_LOGIN = MockUserData.login;
const MOCK_PASSWORD = MockUserData.password;
const MOCK_INVALID_LOGIN = 'mock@invalid.login';
const MOCK_INVALID_PASSWORD = 'invalid_password';

describe('POST /api/auth/sign-in', () => {
  beforeAll(async () => {
    await api.post('/auth/sign-up').send({ login: MOCK_LOGIN, password: MOCK_PASSWORD });
  });

  it('returns access_token and write auth cookies if user exists', async () => {
    await api
      .post('/auth/sign-in')
      .send({ login: MOCK_LOGIN, password: MOCK_PASSWORD })
      .expect(200)
      .then(response => {
        expect(response.body.access_token).toMatch(ACCESS_TOKEN_REGEXP);
        expect(response.headers['set-cookie']).toEqual(
          expect.arrayContaining([
            expect.stringMatching(ID_TOKEN_COOKIE_REGEXP),
            expect.stringMatching(REFRESH_TOKEN_COOKIE_REGEXP),
          ]),
        );
      });
  });

  it('returns 401 if credentials are invalid', async () => {
    await api
      .post('/auth/sign-in')
      .send({ login: MOCK_LOGIN, password: MOCK_INVALID_PASSWORD })
      .expect(401)
      .then(response => {
        expect(response.body.message).toBe('Invalid credentials');
      });

    await api
      .post('/auth/sign-in')
      .send({ login: MOCK_INVALID_LOGIN, password: MOCK_PASSWORD })
      .expect(401)
      .then(response => {
        expect(response.body.message).toBe('Invalid credentials');
      });
  });

  it('returns 400 if user inputs insufficient data', async () => {
    await api
      .post('/auth/sign-in')
      .send({ login: MOCK_LOGIN })
      .expect(400)
      .then(response => {
        expect(response.body.message[0]).toBe('password: Required');
      });
  });
});
