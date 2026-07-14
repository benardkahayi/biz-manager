// hash-password.js
// This script takes a plain password and prints its bcrypt hash
const bcrypt = require('bcryptjs'); // or 'bcrypt' — check which one your project uses

const newPassword = 'Test1234!'; 
const saltRounds = 10; // standard strength, matches most Next.js auth setups

bcrypt.hash(newPassword, saltRounds).then((hash) => {
  console.log('New hash to paste into Neon:');
  console.log(hash);
});

