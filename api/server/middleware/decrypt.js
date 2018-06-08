const encrypt = require('../utils/encrypt');

function decryptPassword() {
  return async function(ctx, next) {

    const body = ctx.request.body;

    if(!body || !body.password || body.password === '') {
      ctx.status = 400;
      ctx.body = 'Please Input Password';
      return;
    };
    if(!body || !body.salt || body.salt === '') {
      ctx.status = 400;
      ctx.body = 'Please Input Salt';
      return;
    };
    if(!body || !body.encPrivKey) {
      ctx.status = 400;
      ctx.body = 'Please Input EncPrivKey';
      return;
    };

    const pwDerivedKey = await encrypt.deriveKeyFromPasswordAndSalt(body.password, body.salt);;
    if(!encrypt.isDerivedKeyCorrect(body.encPrivKey, pwDerivedKey)) {
      ctx.status = 400;
      ctx.body = 'Password Incorrect Input';
      return;
    };

    ctx.user = {
      privateKey: encrypt.decryptString(body.encPrivKey, pwDerivedKey)
    };
    await next();
  };
}

module.exports = {
  decryptPassword,
}
