'use strict';

const cookie = require('cookie');
const { SESSION_DAYS } = require('../db/user-repository');

const SESSION_COOKIE_NAME = 'md_reader_session';

/**
 * میان‌افزار نشست --- httpOnly session cookie middleware ---
 */

/**
 * @param {{ userRepository: import('../db/user-repository').UserRepository }} options
 * @returns {import('express').RequestHandler}
 */
function createSessionMiddleware(options) {
  const { userRepository } = options;

  return function sessionMiddleware(request, response, next) {
    const cookies = cookie.parse(request.headers.cookie || '');
    const token = cookies[SESSION_COOKIE_NAME];
    const sessionUser = userRepository.findUserBySessionToken(token);

    request.sessionToken = token;
    request.user = sessionUser
      ? {
          id: Number(sessionUser.id),
          username: String(sessionUser.username),
          role: String(sessionUser.role),
        }
      : null;

    /**
     * Sets session cookie on response.
     * @param {string} sessionToken
     */
    request.setSessionCookie = (sessionToken) => {
      response.setHeader(
        'Set-Cookie',
        cookie.serialize(SESSION_COOKIE_NAME, sessionToken, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: SESSION_DAYS * 24 * 60 * 60,
        }),
      );
    };

    request.clearSessionCookie = () => {
      response.setHeader(
        'Set-Cookie',
        cookie.serialize(SESSION_COOKIE_NAME, '', {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        }),
      );
    };

    next();
  };
}

/**
 * Requires authenticated user.
 * @type {import('express').RequestHandler}
 */
function requireAuth(request, response, next) {
  if (!request.user) {
    response.status(401).json({ error: 'برای این عمل باید وارد شوید' });
    return;
  }
  next();
}

module.exports = {
  createSessionMiddleware,
  requireAuth,
  SESSION_COOKIE_NAME,
};
