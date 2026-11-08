const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const entorno = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[entorno];

if (process.env.DB_USER) config.username = process.env.DB_USER;
if (process.env.DB_PASSWORD !== undefined) config.password = process.env.DB_PASSWORD;
if (process.env.DB_NAME) config.database = process.env.DB_NAME;
if (process.env.DB_HOST) config.host = process.env.DB_HOST;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false
});

const db = {};

fs.readdirSync(__dirname)
  .filter(function (archivo) { return archivo !== 'index.js' && archivo.slice(-3) === '.js'; })
  .forEach(function (archivo) {
    const modelo = require(path.join(__dirname, archivo))(sequelize, Sequelize.DataTypes);
    db[modelo.name] = modelo;
  });

Object.keys(db).forEach(function (nombre) {
  if (db[nombre].associate) db[nombre].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
