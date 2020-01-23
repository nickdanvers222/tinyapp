const { assert } = require('chai');

const { emailHelper, urlsForUser, generateRandomString, httpChecker } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur",
    userID: 5

  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk",
    userID: 5
  }
};
const urlDatabase = {
    f1: { longURL: "https://www.tsn.ca", userID: 1 },
    f2: { longURL: "https://www.google.ca", userID: 2 },
    f3: { longURL: "https://www.google.ca", userID: 1 }

  };


describe('emailHelper', function() {
  it('should return a user with valid email', function() {
    const user = emailHelper("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user["id"],expectedOutput)
  });
  it('should return undefined if invalid email', () => {
    const user = emailHelper("ndanvers222@gmail.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user["id"], expectedOutput);
  });
});

describe('generateRandomString', () => {
    it('should return a string', () => {
      const sentence = generateRandomString();
      const expectedOutput = "string";
      assert.equal((typeof sentence),expectedOutput)
    });
    it('should return a string with a length of 6', () => {
      const sentence = generateRandomString();
      const expectedOutput = 6;
      assert.equal(sentence.length , expectedOutput);
    });
  });

describe('urlsForUser', ()=>{
    it("Should return one object with the according userID", ()=> {
    const user = urlsForUser(urlDatabase, 2);
    const expected = 1;
    assert.equal(Object.keys(user).length, expected)
    });
    it("Should return an object", () => {
    const user = urlsForUser(urlDatabase, 2);
    const expected = "object";
    assert.equal((typeof user), expected)
    });
});

describe('httpChecker', ()=>{
  it("Should return a string with HTTP:// added if it was not present", ()=> {
  const url = "www.google.ca";
  const expected = "http://www.google.ca"
  assert.equal(httpChecker(url), expected)
  });
  it("Should return a unmolested string if HTTP is prent", () => {
  const url = "http://www.example.com";
  const expected = "http://www.example.com";
  assert.equal(httpChecker(url), expected)
  });
});