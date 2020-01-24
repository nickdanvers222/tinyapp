//# Generates a random alpha numeric 6 diget long string.
//
const generateRandomString = () => {
  return (Math.random().toString(36)).substr(2,6);
};

// Checks to see if the email address is present in the user database
// to reject a duplicate email on registration
const emailHelper = (email, usersObj) => {
  for (const ids in usersObj) {
    const user = usersObj[ids];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

// Searches within an nested object for the USERID, and returns
// the objects matching the corresponding USERID
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

// checks to see if the given URL has HTTP:// included, if not,
// concat it
const httpChecker = (url) => {
  if (!(url.includes("http://"))) {
    return "http://" + url;
  }
  return url;
};
//
module.exports = {
  generateRandomString,
  emailHelper,
  urlsForUser,
  httpChecker,
};