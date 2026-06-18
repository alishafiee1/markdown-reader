'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/session');
const { createAuthRateLimiter } = require('../middleware/rate-limit-auth');

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/;
const DEFAULT_MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 128;

/**
 * احراز هویت --- register, login, logout, me ---
 */

/**
 * @returns {number}
 */
function getMinimumPasswordLength() {
  const configured = Number(process.env.AUTH_MIN_PASSWORD_LENGTH);
  return Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_MIN_PASSWORD_LENGTH;
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {string|undefined}
 */
function validateRegistrationInput(username, password) {
  if (!USERNAME_PATTERN.test(username)) {
    return 'نام کاربری باید ۳ تا ۳۲ کاراکتر و فقط شامل حروف انگلیسی، عدد یا _ باشد';
  }
  if (password.length < getMinimumPasswordLength()) {
    return `رمز عبور باید حداقل ${getMinimumPasswordLength()} کاراکتر باشد`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return 'رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد';
  }
  return undefined;
}

/**
 * @param {import('../db/user-repository').UserRepository} userRepository
 * @param {{ id: number|string, username: string, role: string }} user
 * @returns {Promise<boolean>}
 */
async function computeNeedsPasswordChange(userRepository, user) {
  if (String(user.role) !== 'admin' || String(user.username) !== 'admino') {
    return false;
  }
  return userRepository.isUsingSeedPassword(Number(user.id));
}

/**
 * @param {{ userRepository: import('../db/user-repository').UserRepository }} options
 * @returns {import('express').Router}
 */
function createAuthRouter(options) {
  const router = express.Router();
  const { userRepository } = options;
  const authRateLimiter = createAuthRateLimiter();

  router.post('/auth/register', authRateLimiter, async (request, response) => {
    try {
      const username = String(request.body?.username || '').trim();
      const password = String(request.body?.password || '').trim();

      const validationError = validateRegistrationInput(username, password);
      if (validationError) {
        response.status(400).json({ error: validationError });
        return;
      }
      if (userRepository.findByUsername(username)) {
        response.status(409).json({ error: 'این نام کاربری قبلاً ثبت شده است' });
        return;
      }

      const user = await userRepository.createUser({ username, password, role: 'user' });
      const session = await userRepository.createSession(Number(user.id));
      request.setSessionCookie(session.token);

      const prefs = userRepository.getPreferences(Number(user.id));
      response.status(201).json({
        id: Number(user.id),
        username: String(user.username),
        role: String(user.role),
        preferences: {
          readingTheme: String(prefs?.reading_theme || 'night'),
          fontScale: String(prefs?.font_scale || 'normal'),
        },
        needsPasswordChange: false,
      });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.post('/auth/login', authRateLimiter, async (request, response) => {
    try {
      const username = String(request.body?.username || '').trim();
      const password = String(request.body?.password || '');

      const valid = await userRepository.verifyPassword(username, password);
      if (!valid) {
        response.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
        return;
      }

      const user = userRepository.findByUsername(username);
      const session = await userRepository.createSession(Number(user.id));
      request.setSessionCookie(session.token);

      const prefs = userRepository.getPreferences(Number(user.id));
      const needsPasswordChange = await computeNeedsPasswordChange(userRepository, user);

      response.json({
        id: Number(user.id),
        username: String(user.username),
        role: String(user.role),
        preferences: {
          readingTheme: String(prefs?.reading_theme || 'night'),
          fontScale: String(prefs?.font_scale || 'normal'),
        },
        needsPasswordChange,
      });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.post('/auth/logout', requireAuth, async (request, response) => {
    try {
      if (request.sessionToken) {
        await userRepository.logout(request.sessionToken);
      }
      request.clearSessionCookie();
      response.status(204).send();
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.get('/me', async (request, response) => {
    try {
      if (!request.user) {
        response.status(401).json({ error: 'وارد نشده‌اید' });
        return;
      }
      const prefs = userRepository.getPreferences(request.user.id);
      const needsPasswordChange = await computeNeedsPasswordChange(userRepository, request.user);

      response.json({
        id: request.user.id,
        username: request.user.username,
        role: request.user.role,
        preferences: {
          readingTheme: String(prefs?.reading_theme || 'night'),
          fontScale: String(prefs?.font_scale || 'normal'),
        },
        needsPasswordChange,
      });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.put('/me/preferences', requireAuth, async (request, response) => {
    try {
      const readingTheme = request.body?.readingTheme;
      const fontScale = request.body?.fontScale;
      const allowedThemes = new Set(['day', 'sepia', 'dim', 'night']);
      const allowedScales = new Set(['normal', 'large', 'xlarge']);

      if (readingTheme && !allowedThemes.has(readingTheme)) {
        response.status(400).json({ error: 'تم نامعتبر است' });
        return;
      }
      if (fontScale && !allowedScales.has(fontScale)) {
        response.status(400).json({ error: 'اندازه فونت نامعتبر است' });
        return;
      }

      await userRepository.updatePreferences(request.user.id, {
        readingTheme,
        fontScale,
      });

      const prefs = userRepository.getPreferences(request.user.id);
      response.json({
        readingTheme: String(prefs?.reading_theme || 'night'),
        fontScale: String(prefs?.font_scale || 'normal'),
      });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  return router;
}

module.exports = {
  computeNeedsPasswordChange,
  createAuthRouter,
  validateRegistrationInput,
};
