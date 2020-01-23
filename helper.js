const generateRandomString = () => {
  return (Math.random().toString(36)).substr(2,6);
};
//
const emailHelper = (email, users) => {
  for (const ids in users) {
    const user = users[ids];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};
//
const urlsForUser = (database, userID) => {
  const newObj = {};
  for (const items in database) {
    const urls = database[items];
    if (urls["userID"] === userID) {
      newObj[items] = {
        longURL: urls["longURL"],
        userID,
      };
    }
  }
  return newObj;
};
//
module.exports = {
  generateRandomString,
  emailHelper,
  urlsForUser
};