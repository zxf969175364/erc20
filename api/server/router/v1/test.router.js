const Router = require('koa-router');
const testCtrl = require('../../controller/v1/test.ctrl');
const decrypt = require('../../middleware/decrypt');

const router = new Router();

router.get('/api/getBalance', testCtrl.getBalance);
router.post('/api/transferFrom', decrypt.decryptPassword(), testCtrl.transferFrom);
router.get('/api/getPrivateKey', testCtrl.getPrivateKey);
router.post('/api/mintToken', testCtrl.mintToken);
router.post('/api/freezeAccount', testCtrl.freezeAccount);
router.post('/api/setPrices', testCtrl.setPrices);
router.post('/api/burn', testCtrl.burn);
router.post('/api/burnFrom', testCtrl.burnFrom);
router.post('/api/approve', testCtrl.approve);
router.post('/api/transferOwnership', testCtrl.transferOwnership);
router.get('/api/getOwnerAddress', testCtrl.getOwnerAddress);

module.exports = router;
