const log4js = require('log4js');

const logConfig = require('../config/log4js.config');
const moment = require('moment');

log4js.configure(logConfig);

const logUtil = {};

const errorLogger = log4js.getLogger('error');
const resLogger = log4js.getLogger('default');


// 格式化请求日志
const formatReqLog = function (ctx, req) {
  let logText = String();

  const method = req.method;
  // 访问时间
  logText += `${moment().format()} `;

  // 访问方法
  logText += `${method} `;

  // 请求原始地址
  logText += `${req.originalUrl} `;

  const params = {
    client: ctx.client,
    token: ctx.header.authorization,
    userId: ctx && ctx.user ? ctx.user.id : '',
  };

  // 用户token client信息
  logText += `${JSON.stringify(params)} `;

  // 请求query参数
  logText += `${JSON.stringify(req.query)} `;

  // 请求body参数
  logText += `${JSON.stringify({ data: req.body })} `;

  // 请求返回值
  logText += `${JSON.stringify({ result: ctx.response.body })} `;

  return logText;
};

// 格式化错误日志
const formatError = function (ctx, err, resTime) {
  let logText = String();

  // 响应日志开始
  logText += 'error ';

  // 添加请求日志
  logText += formatReqLog(ctx, ctx.request, resTime);

  const res = {
    status: ctx.status,
    message: err.message,
  };
  // 响应内容
  logText += `${JSON.stringify(res)} `;

  // 响应时间
  logText += `${moment().format()} `;

  // 响应时间
  logText += `${resTime}ms\n`;

  return logText;
};

// 格式化题转HTML错误日志
const questionFormatError = function (ctx, err, resTime) {
  let logText = String();

  // 响应日志开始
  logText += 'QuestionFormatError ';

  // 添加请求日志
  logText += formatReqLog(ctx, ctx.request, resTime);

  const res = {
    status: ctx.status,
    message: err.message,
  };
  // 响应内容
  logText += `${JSON.stringify(res)} `;

  // 响应时间
  logText += `${moment().format()} `;

  // 响应时间
  logText += `${resTime}ms\n`;

  return logText;
};

// 格式化响应日志
const formatRes = function (ctx, resTime) {
  let logText = String();

  // 响应日志开始
  logText += 'info ';

  // 添加请求日志
  logText += formatReqLog(ctx, ctx.request, resTime);

  const res = {
    status: ctx.status,
  };
  // 响应内容
  logText += `${JSON.stringify(res)} `;

  // 响应时间
  logText += `${moment().format()} `;

  // 响应时间
  logText += `${resTime}ms\n`;

  return logText;
};


logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};

logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
};

logUtil.logQuestionFormatError = function (ctx, error, resTime) {
  if (ctx) {
    errorLogger.error(questionFormatError(ctx, error, resTime));
  }
};

module.exports = logUtil;
