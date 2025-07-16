const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT || 'mysql',
    port: 3306,
    dialectOptions: {
      connectTimeout: 10000
    },
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base réussie.');
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();