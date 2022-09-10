const bkfd2Password = require('pbkdf2-password')

const hasher = bkfd2Password()

module.exports.hasher = async args => await new Promise((resolve, reject) => {
  hasher({
    password: args.password,
    salt: args.salt,
  }, async (err, pass, salt, hash) => {
    if (err)
      return reject({code: 500, message: err})
    resolve({hash, salt})
  })
})
