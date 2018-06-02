const superagent = require('superagent');

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(config, path) {
  const adjestedPath = path[0] !== '/' ? `/${path}` : path;
  const port = config.port || '';
  const protol = config.protol || 'http';
  return `${protol}://${config.host}:${port}${adjestedPath}`;
}

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["empty"] }] */
/* eslint arrow-parens: 0 */
/* eslint no-return-assign: 0 */
module.exports = class HttpClient {
  constructor(config) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, headers } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(config, path));
        request.set('Accept', 'application/json');
        if (params) {
          request.query(params);
        }
        if (data) {
          request.send(data);
        }
        if (headers) {
          request.set(headers);
        }
        request.end((err, res) => {
          const body = res && res.body;
          if (err || !res) {
            return reject(new Error('服务器异常'));
          }
          if (body[config.successCodeField] !== config.successCode) {
            return reject(new Error(body[config.errorMsgField]));
          }
          return resolve(body);
        });
      }));
  }

  empty() {}
};
