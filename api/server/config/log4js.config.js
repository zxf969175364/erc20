module.exports = {
  appenders: {
    out: { type: 'console' },
    task: { type: 'dateFile', filename: 'logs/task/task', pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },
    result: { type: 'dateFile', filename: 'logs/result/result', pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },
    error: { type: 'dateFile', filename: 'logs/error/error', pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },
    default: { type: 'dateFile', filename: 'logs/default/default', pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },
    rate: { type: 'dateFile', filename: 'logs/rate/rate', pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },
  },
  categories: {
    default: { appenders: ['default'], level: 'info' },
    task: { appenders: ['task'], level: 'info' },
    result: { appenders: ['result'], level: 'info' },
    error: { appenders: ['out', 'error'], level: 'error' },
    rate: { appenders: ['rate'], level: 'info' },
  },
};
