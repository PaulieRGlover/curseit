import { api } from '../client';
import {
  ACCESS_TOKEN_REGEXP,
  ID_TOKEN_COOKIE_REGEXP,
  REFRESH_TOKEN_COOKIE_REGEXP,
} from '../constants';
import { MockUserData } from '../helpers';

const MOCK_LOGIN = MockUserData.login;
const MOCK_PASSWORD = MockUserData.password;

describe('GET /api/auth/refresh', () => {
  let accessToken: string;
  let idToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const response = await api
      .post('/auth/sign-up')
      .send({ login: MOCK_LOGIN, password: MOCK_PASSWORD });

    const cookies = response.headers['set-cookie'];
    if (Array.isArray(cookies)) {
      accessToken = response.body.access_token;

      idToken = cookies
        .find(cookie => cookie.match(ID_TOKEN_COOKIE_REGEXP))
        ?.replace(/^id_token=/, '');

      refreshToken = cookies
        .find(cookie => cookie.match(REFRESH_TOKEN_COOKIE_REGEXP))
        ?.replace(/^refresh_token=/, '');
    }

    if (
      typeof accessToken !== 'string' ||
      typeof idToken !== 'string' ||
      typeof refreshToken !== 'string'
    ) {
      throw new Error('Tokens were not correctly retrieved by /auth/sign-up');
    }
  });

  it('returns new access token and rotates the refresh token', async () => {
    await api
      .get('/auth/refresh')
      .set('Cookie', [`refresh_token=${refreshToken}`])
      .expect(200)
      .then(response => {
        const newAccessToken = response.body.access_token;
        expect(newAccessToken).toMatch(ACCESS_TOKEN_REGEXP);
        expect(newAccessToken).not.toBe(accessToken);

        const cookiesHeaders = response.headers['set-cookie'];
        expect(Array.isArray(cookiesHeaders)).toBe(true);
        const cookies = (cookiesHeaders as unknown as Array<string>);

        const newIdToken = cookies
          .find(cookie => cookie.match(ID_TOKEN_COOKIE_REGEXP))
          ?.replace(/^id_token=/, '');
        expect(newIdToken).toBeDefined();
        expect(newIdToken).toBe(idToken)
        
        const newRefreshToken = cookies
          .find(cookie => cookie.match(REFRESH_TOKEN_COOKIE_REGEXP))
          ?.replace(/^refresh_token=/, '');
        expect(newRefreshToken).toBeDefined();
        expect(newRefreshToken).not.toBe(refreshToken);
      });
  });
});
