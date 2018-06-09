const Router = require('koa-router');
const testCtrl = require('../../controller/v1/test.ctrl');
const decrypt = require('../../middleware/decrypt');

const router = new Router();

router.get('/api/balance', testCtrl.getBalance);
router.post('/api/transfer', decrypt.decryptPassword(), testCtrl.transfer);
router.get('/api/getGethPrivateKey', testCtrl.getGethPrivateKey);
router.post('/api/encryptString', testCtrl.getEncryptString);
router.post('/api/mintToken', decrypt.decryptPassword(), testCtrl.mintToken);
router.post('/api/frozenAccount', decrypt.decryptPassword(), testCtrl.setFrozenAccount);
router.get('/api/frozenAccount', testCtrl.getFrozenAccount);
router.post('/api/burn',decrypt.decryptPassword(), testCtrl.burn);
router.post('/api/burnFrom', decrypt.decryptPassword(), testCtrl.burnFrom);
router.post('/api/updateOwnerAddress', decrypt.decryptPassword(), testCtrl.updateOwnerAddress);
router.get('/api/getOwnerAddress', testCtrl.getOwnerAddress);
router.get('/api/getTokenERC20', testCtrl.getTokenERC20);
router.post('/api/registerTokenERC20', decrypt.decryptPassword(), testCtrl.registerTokenERC20);
router.post('/api/allowance', decrypt.decryptPassword(), testCtrl.setAllowance);
router.get('/api/allowance', testCtrl.getAllowance);
router.post('/api/fee', decrypt.decryptPassword(), testCtrl.setFee);
router.get('/api/fee', testCtrl.getFee);
router.post('/api/feeAccount', decrypt.decryptPassword(), testCtrl.setFeeAccount);
router.get('/api/feeAccount', testCtrl.getFeeAccount);
router.post('/api/maxTransferNum', decrypt.decryptPassword(), testCtrl.setMaxTransferNum);
router.get('/api/maxTransferNum', testCtrl.getMaxTransferNum);

module.exports = router;
