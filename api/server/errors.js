const log4js = require('../server/utils/log4js.util');

class ApiError extends Error {
  constructor (ctx, code, message) {
    super(typeof code === 'string' ? code : message || '服务器异常');
    Error.captureStackTrace(this, this.constructor);
    const name = this.constructor.name;
    this.name = this.constructor.name;
    this.status = 500;
    if (typeof code === 'string') {
      this.code = 500;
    } else {
      this.code = code || 500;
    }
    ctx.response.status = this.code;
    ctx.response.message = message;
    log4js.logError(ctx, {
      name: name,
      message: message,
    });
  }
}
module.exports = {
  ApiError,
};
