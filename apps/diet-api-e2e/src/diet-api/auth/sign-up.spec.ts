import { api } from '../client';
import {
  ACCESS_TOKEN_REGEXP,
  ID_TOKEN_COOKIE_REGEXP,
  REFRESH_TOKEN_COOKIE_REGEXP,
} from '../constants';
import { MockUserData } from '../helpers';

const MOCK_LOGIN = MockUserData.login;
const MOCK_PASSWORD = MockUserData.password;

describe('POST /api/auth/sign-up', () => {
  it('returns access_token and write auth cookies', async () => {
    await api
      .post('/auth/sign-up')
      .send({ login: MOCK_LOGIN, password: MOCK_PASSWORD })
      .expect(201)
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

  it('returns 409 if login is already taken', async () => {
    await api
      .post('/auth/sign-up')
      .send({ login: MOCK_LOGIN, password: MOCK_PASSWORD })
      .expect(409)
      .then(response => {
        expect(response.body.message).toBe('Credentials taken');
      });
  });

  it('returns 400 if user inputs insufficient data', async () => {
    await api
      .post('/auth/sign-up')
      .send({ login: MOCK_LOGIN })
      .expect(400)
      .then(response => {
        expect(response.body.message[0]).toBe('password: Required');
      });

    await api
      .post('/auth/sign-up')
      .send({ password: MOCK_PASSWORD })
      .expect(400)
      .then(response => {
        expect(response.body.message[0]).toBe('login: Required');
      });
  });
});
