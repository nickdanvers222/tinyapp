const generateRandomString = () => {
  return (Math.random().toString(36)).substr(2,6);
};
//
const emailHelper = (email, usersObj) => {
  for (const ids in usersObj) {
    const user = usersObj[ids];
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

const obj = {
    1: {email: "one"},
    2: {email: "two"},
    3: {email: "ndanvers222@gmail.com"},
    4: {email: "4"}
}

console.log(emailHelper("ndanvers222@gmail.com", obj));