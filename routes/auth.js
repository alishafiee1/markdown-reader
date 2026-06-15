'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/session');

/**
 * احراز هویت --- register, login, logout, me ---
 */

/**
 * @param {{ userRepository: import('../db/user-repository').UserRepository }} options
 * @returns {import('express').Router}
 */
function createAuthRouter(options) {
  const router = express.Router();
  const { userRepository } = options;

  router.post('/auth/register', async (request, response) => {
    try {
      const username = String(request.body?.username || '').trim();
      const password = String(request.body?.password || '');

      if (username.length < 3) {
        response.status(400).json({ error: 'نام کاربری باید حداقل ۳ کاراکتر باشد' });
        return;
      }
      if (password.length < 4) {
        response.status(400).json({ error: 'رمز عبور باید حداقل ۴ کاراکتر باشد' });
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

  router.post('/auth/login', async (request, response) => {
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
      const seedPassword = process.env.ADMIN_SEED_PASSWORD || 'admino';
      const needsPasswordChange =
        String(user.role) === 'admin' &&
        String(user.username) === 'admino' &&
        password === seedPassword;

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

  router.get('/me', (request, response) => {
    if (!request.user) {
      response.status(401).json({ error: 'وارد نشده‌اید' });
      return;
    }
    const prefs = userRepository.getPreferences(request.user.id);
    const seedPassword = process.env.ADMIN_SEED_PASSWORD || 'admino';
    const needsPasswordChange =
      request.user.role === 'admin' &&
      request.user.username === 'admino';

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
  createAuthRouter,
};
