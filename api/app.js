const Koa = require('koa');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const errorHandler = require('koa-json-error');
const compress = require('koa-compress');
const compressFlush = require('zlib').Z_SYNC_FLUSH;
const _ = require('lodash');
const dotenv = require('dotenv').config();

const routing = require('./server/router');
const appConfig = require('./server/config/app.config');
const logUtil = require('./server/utils/log4js.util');
// const cors = require('koa2-cors');

const app = new Koa();

app.proxy = true;

app.use(compress({
  filter: function (contentType) {
    return /json/i.test(contentType);
  },
  threshold: 2048,
  flush: compressFlush,
}));


// 日志中间件
app.use(logger());

// http body解析
app.use(koaBody());

// error handler
app.use(errorHandler({
  format: err => ({ code: err.code, message: err.message, stack: err.stack }),
  postFormat: (e, obj) => (process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj),
}));

// logger
app.use(async (ctx, next) => {
  // 响应开始时间
  const start = new Date();
  // 响应间隔时间
  let ms;
  try {
    // 开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    // 记录响应日志
    if (ctx.response.status === 200) {
      logUtil.logResponse(ctx, ms);
    }
  } catch (error) {
    ms = new Date() - start;
    // 记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});

// 路由加载
routing(app);

// 启动server
app.listen(appConfig.port);

if (!dotenv.error) {
  console.log('working with .env:');
  console.log(dotenv.parsed);
}
console.log(`server is up at ${appConfig.port}`);
