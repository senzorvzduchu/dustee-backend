const User = require('User');

// vytvoření nového uživatele
const user = new User('John', 'john@example.com', 'johnspassword');
user.save()
  .then(() => console.log('User saved'))
  .catch(err => console.error(err));

// nalezení uživatele
User.find('john@example.com')
  .then(user => console.log(user))
  .catch(err => console.error(err));

// aktualizace uživatele
User.update('john@example.com', { password: 'newpassword' })
  .then(() => console.log('User updated'))
  .catch(err => console.error(err));

// smazání uživatele
User.delete('john@example.com')
  .then(() => console.log('User deleted'))
  .catch(err => console.error(err));

// aktualize stávajícího uživatele
User.updateProperties('john@example.com', 'New Address', 'New Sensor')
  .then(() => console.log('User properties updated'))
  .catch(err => console.error(err));

// přidání properties pro nového uživatele
const user = new User('John', 'john@example.com', 'johnspassword');
user.addProperties('Some Address', 'Some Sensor')
  .then(() => console.log('User and properties saved'))
  .catch(err => console.error(err));
