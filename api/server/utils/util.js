const math = require('mathjs');

exports.fromWei = function(value, decimals) {
  if ((!value && value !== 0) || (!decimals && decimals !== 0)) throw new Error('value or decimals error');
  return value / Math.pow(10, decimals);
};

exports.toWei = function(value, decimals) {
  if ((!value && value !== 0) || (!decimals && decimals !== 0)) throw new Error('value or decimals error');
  return math.bignumber(value * Math.pow(10, decimals)).toFixed();
};
