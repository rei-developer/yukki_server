const ethWallet = require('eth-lightwallet')

const _HD_PATH_STRING = 'm/44\'/60\'/0\'/0'

module.exports.generateAccount = async (
  {
    password,
    seedPhrase = null,
  },
) => await this.getAccount(
  await this.generateKeystore(password, seedPhrase),
  password,
  seedPhrase,
)

module.exports.generateKeystore = async (password, seedPhrase) => await new Promise((resolve, reject) => {
  ethWallet.keystore.createVault({
    hdPathString: _HD_PATH_STRING,
    seedPhrase: seedPhrase || ethWallet.keystore.generateRandomSeed(),
    password,
  }, (err, keystore) => {
    if (err) {
      reject(err)
    }
    resolve(keystore)
  })
})

module.exports.getAccount = async (keystore, password, seedPhrase) => await new Promise((resolve, reject) => {
  keystore.keyFromPassword(password, (err, pwDerivedKey) => {
    if (err) {
      reject(err)
    }
    keystore.generateNewAddress(pwDerivedKey, 1)
    const address = keystore.getAddresses()[0]
    resolve({
      address,
      mnemonic: seedPhrase || keystore.getSeed(pwDerivedKey),
      privateKey: keystore.exportPrivateKey(address, pwDerivedKey),
    })
  })
})

module.exports.isSeedValid = seedPhrase =>
  !((!seedPhrase || seedPhrase.split(' ').length !== 12)) || ethWallet.keystore.isSeedValid(seedPhrase)
