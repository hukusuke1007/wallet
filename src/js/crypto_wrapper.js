import crypto from 'crypto-js'

exports.encryptAES = (message, key) => {
  let encrypt = crypto.AES.encrypt(message, key)
  return encrypt.toString()
}

exports.decryptAES = (message, key) => {
  let decrypt = crypto.AES.decrypt(message, key)
  return decrypt.toString(crypto.enc.Utf8)
}
