const scrypt = require('scrypt-async');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util')

function encryptString(string, pwDerivedKey) {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const encObj = nacl.secretbox(nacl.util.decodeUTF8(string), nonce, pwDerivedKey);
  const encString = { 'encStr': nacl.util.encodeBase64(encObj),
                    'nonce': nacl.util.encodeBase64(nonce)};
  return encString;
};

function decryptString(encryptedStr, pwDerivedKey) {
  const secretbox = nacl.util.decodeBase64(encryptedStr.encStr);
  const nonce = nacl.util.decodeBase64(encryptedStr.nonce);
  const decryptedStr = nacl.secretbox.open(secretbox, nonce, pwDerivedKey);
  if (decryptedStr === undefined) {
    throw new Error("Decryption failed!");
  }
  return nacl.util.encodeUTF8(decryptedStr);
};

function isDerivedKeyCorrect(encSeed, pwDerivedKey) {
  try {
    const paddedSeed = decryptString(encSeed, pwDerivedKey);
    if (paddedSeed.length > 0) {
      return true;
    }
    return false;
  } catch(error) {
    return false;
  }
};

function exportPrivateKey(encPrivKey, pwDerivedKey) {

  if (!isDerivedKeyCorrect(encPrivKey, pwDerivedKey)) {
    throw new Error("Incorrect derived key!");
  }

  const privKey = decryptString(encPrivKey, pwDerivedKey);

  return privKey;
};

async function deriveKeyFromPasswordAndSalt(password, salt) {
  // Do not require salt, and default it to 'lightwalletSalt'
  // (for backwards compatibility)
  var logN = 14;
  var r = 8;
  var dkLen = 32;
  var interruptStep = 200;


  return new Promise(function(resolve, reject) {
    var cb = function(derKey) {
      var err = null
      var ui8arr = null
      try{
        ui8arr = (new Uint8Array(derKey));
        resolve(ui8arr);
      } catch (e) {
        reject(e);
      }
    }
    scrypt(password, salt, logN, r, dkLen, interruptStep, cb, null);
  })
}

function add0x(input) {
  if (typeof input !== 'string') {
    return input;
  }
  if (input.length < 2 || input.slice(0, 2) !== '0x') {
    return '0x' + input;
  }

  return input;
}

function strip0x(input) {
  if (typeof input !== 'string') {
    return input;
  } else if (input.length >= 2 && input.slice(0, 2) === '0x') {
    return input.slice(2);
  } else {
    return input;
  }
}

module.exports = {
  add0x,
  strip0x,
  deriveKeyFromPasswordAndSalt,
  exportPrivateKey,
  isDerivedKeyCorrect,
  decryptString,
  encryptString,
}
