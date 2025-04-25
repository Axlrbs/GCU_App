const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('database_development', 'postgres', 'password', {
  host: '127.0.0.1',
  dialect: 'postgres', // ou mysql/sqlite
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion réussie à la base de données !');
  } catch (error) {
    console.error('Erreur de connexion :', error);
  }
})();
