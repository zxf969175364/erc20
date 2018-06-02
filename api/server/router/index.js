const _ = require('lodash');
const r1 = require('./v1');

const routes = _.union(r1);

module.exports = function (app) {
  routes.forEach((route) => {
    app.use(route.routes())
      .use(route.allowedMethods({ throw: true }));
  });
};
