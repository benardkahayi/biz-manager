// hash-password.js
const bcrypt = require('bcryptjs');
bcrypt.hash('liquorstore', 10).then((hash) => console.log(hash));