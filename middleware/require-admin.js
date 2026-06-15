'use strict';

/**
 * محدودیت ادمین --- admin-only route guard ---
 */

/**
 * @type {import('express').RequestHandler}
 */
function requireAdmin(request, response, next) {
  if (!request.user) {
    response.status(401).json({ error: 'برای این عمل باید وارد شوید' });
    return;
  }
  if (request.user.role !== 'admin') {
    response.status(403).json({ error: 'دسترسی فقط برای مدیر' });
    return;
  }
  next();
}

module.exports = {
  requireAdmin,
};
