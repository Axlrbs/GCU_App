// rehash-passwords.js
const bcrypt = require('bcrypt');
const db = require('./models');
const Utilisateur = db.utilisateur;

async function run() {
  const users = await Utilisateur.findAll();
  for (const u of users) {
    // on ne ré-hashe que si ce n'est pas déjà un hash Bcrypt
    if (!u.motDePasse.startsWith('$2')) {
      const newHash = await bcrypt.hash(u.motDePasse, 10);
      await Utilisateur.update(
        { motDePasse: newHash },
        { where: { utilisateurId: u.utilisateurId } }
      );
      console.log(`✔️  Re-hashé ${u.email}`);
    }
  }
  process.exit(0);
}
run().catch(e => {
  console.error(e);
  process.exit(1);
});
