'use strict';

const rateLimit = require('express-rate-limit');

const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX = 10;

/**
 * محدودکننده احراز هویت --- rate limit login and register endpoints ---
 */

/**
 * @returns {import('express').RequestHandler}
 */
function createAuthRateLimiter() {
  return rateLimit({
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
    max: AUTH_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test' || process.env.MD_READER_RUN_TESTS === '1',
    message: { error: 'تعداد تلاش‌ها زیاد شد؛ لطفاً چند دقیقه دیگر دوباره امتحان کنید' },
  });
}

module.exports = {
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW_MS,
  createAuthRateLimiter,
};
