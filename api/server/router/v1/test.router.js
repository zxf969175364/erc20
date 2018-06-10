const Router = require('koa-router');
const testCtrl = require('../../controller/v1/test.ctrl');
const decrypt = require('../../middleware/decrypt');

const router = new Router();

// 获取余额
router.get('/api/balance', testCtrl.getBalance);
// 转账
router.post('/api/transfer', decrypt.decryptPassword(), testCtrl.transfer);
// 忽略
router.get('/api/getGethPrivateKey', testCtrl.getGethPrivateKey);
// 加密私钥
router.post('/api/encryptString', testCtrl.getEncryptString);
// 铸币
router.post('/api/mintToken', decrypt.decryptPassword(), testCtrl.mintToken);
// 冻结账户 查询账户是否冻结
router.post('/api/frozenAccount', decrypt.decryptPassword(), testCtrl.setFrozenAccount);
router.get('/api/frozenAccount', testCtrl.getFrozenAccount);
// 销毁余额 销毁其他账户余额
router.post('/api/burn',decrypt.decryptPassword(), testCtrl.burn);
router.post('/api/burnFrom', decrypt.decryptPassword(), testCtrl.burnFrom);
// 更新管理员账户 查询管理员账户
router.post('/api/ownerAddress', decrypt.decryptPassword(), testCtrl.updateOwnerAddress);
router.get('/api/ownerAddress', testCtrl.getOwnerAddress);
// 按照key获取对应合约地址 按照key设置对应合约地址
router.get('/api/tokenERC20', testCtrl.getTokenERC20);
router.post('/api/tokenERC20', decrypt.decryptPassword(), testCtrl.registerTokenERC20);
// 设置账户额度 查询账户额度
router.post('/api/allowance', decrypt.decryptPassword(), testCtrl.setAllowance);
router.get('/api/allowance', testCtrl.getAllowance);
// 设置每次转账固定手续费 查询每次转账固定手续费
router.post('/api/fee', decrypt.decryptPassword(), testCtrl.setFee);
router.get('/api/fee', testCtrl.getFee);
// 设置每次转账固定手续费转入地址 查询每次转账固定手续费转入地址
router.post('/api/feeAccount', decrypt.decryptPassword(), testCtrl.setFeeAccount);
router.get('/api/feeAccount', testCtrl.getFeeAccount);
// 设置每次转账最大额度 查询每次转账最大额度
router.post('/api/maxTransferNum', decrypt.decryptPassword(), testCtrl.setMaxTransferNum);
router.get('/api/maxTransferNum', testCtrl.getMaxTransferNum);

module.exports = router;
