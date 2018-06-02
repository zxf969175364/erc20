const Router = require('koa-router');
const testCtrl = require('../../controller/v1/test.ctrl');

const router = new Router();

router.get('/api/getBalance', testCtrl.getBalance);
router.post('/api/transferFrom', testCtrl.transferFrom);
router.get('/api/getPrivateKey', testCtrl.getPrivateKey);
router.post('/api/mintToken', testCtrl.mintToken);
router.post('/api/freezeAccount', testCtrl.freezeAccount);
router.post('/api/setPrices', testCtrl.setPrices);
router.post('/api/burn', testCtrl.burn);
router.post('/api/burnFrom', testCtrl.burnFrom);
router.post('/api/approve', testCtrl.approve);

module.exports = router;
