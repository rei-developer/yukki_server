const pool = require('../database')
const _ = require('lodash')

module.exports.addUser = async columns => {
  let keys = [], values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  return (await pool.query(
    `INSERT INTO Users SET ${keys.map(key => `${key} = ?`).join(', ')}`,
    [...values],
  )).insertId
}

module.exports.getUserById = async id => {
  const result = await pool.query(
    `SELECT
			address,
			isAdmin
		FROM Users
		WHERE id = ?`,
    [id],
  )
  return result[0] || false
}

module.exports.getUserByAuthTypeAndUId = async (authType, uid) => {
  const result = await pool.query(
    `SELECT
			id,
      point,
			isAdmin
		FROM Users
		WHERE authType = ? AND uid = ?`,
    [authType, uid],
  )
  return result[0] || false
}

module.exports.updateUser = async (columns, id) => {
  let keys = [], values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  await pool.query(
    `UPDATE Users SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`,
    [
      ...values,
      id,
    ],
  )
}
