import { api } from '../client';
import {
  ID_TOKEN_COOKIE_DELETION_REGEX,
  REFRESH_TOKEN_COOKIE_DELETION_REGEX,
  REFRESH_TOKEN_COOKIE_REGEX,
} from '../constants';
import { MockUserData } from '../helpers';

const MOCK_LOGIN = MockUserData.login;
const MOCK_PASSWORD = MockUserData.password;

describe.only('POST /api/auth/sign-out', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    const response = await api
      .post('/auth/sign-up')
      .send({ login: MOCK_LOGIN, password: MOCK_PASSWORD });

    const cookies = response.headers['set-cookie'];
    if (Array.isArray(cookies)) {
      accessToken = response.body.access_token;

      refreshToken = cookies
        .find(cookie => cookie.match(REFRESH_TOKEN_COOKIE_REGEX))
        ?.replace(/^refresh_token=/, '');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('Tokens were not correctly retrieved by /auth/sign-up');
    }
  });

  it('returns successful sign-out message', async () => {
    await api
      .post('/auth/sign-out')
      .set('Cookie', [`refresh_token=${refreshToken}`])
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then(response => {
        expect(response.headers['set-cookie']).toEqual(
          expect.arrayContaining([
            expect.stringMatching(ID_TOKEN_COOKIE_DELETION_REGEX),
            expect.stringMatching(REFRESH_TOKEN_COOKIE_DELETION_REGEX),
          ]),
        );
      });
  });

  it('invalidates access token correctly', async () => {
    await api
      .get('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });

  it('invalidates refresh token correctly', async () => {
    await api
      .get('/auth/refresh')
      .set('Cookie', [`refresh_token=${refreshToken}`])
      .expect(401);
  });

  it('runs successfully even if some of the tokens are not passed', async () => {
    await api
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then(response => {
        expect(response.headers['set-cookie']).toEqual(
          expect.arrayContaining([
            expect.stringMatching(ID_TOKEN_COOKIE_DELETION_REGEX),
            expect.stringMatching(REFRESH_TOKEN_COOKIE_DELETION_REGEX),
          ]),
        );
      });

    await api
      .post('/auth/sign-out')
      .set('Cookie', [`refresh_token=${refreshToken}`])
      .expect(200)
      .then(response => {
        expect(response.headers['set-cookie']).toEqual(
          expect.arrayContaining([
            expect.stringMatching(ID_TOKEN_COOKIE_DELETION_REGEX),
            expect.stringMatching(REFRESH_TOKEN_COOKIE_DELETION_REGEX),
          ]),
        );
      });

    await api
      .post('/auth/sign-out')
      .expect(200)
      .then(response => {
        expect(response.headers['set-cookie']).toEqual(
          expect.arrayContaining([
            expect.stringMatching(ID_TOKEN_COOKIE_DELETION_REGEX),
            expect.stringMatching(REFRESH_TOKEN_COOKIE_DELETION_REGEX),
          ]),
        );
      });
  })
});
