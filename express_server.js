const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const { generateRandomString, emailHelper, urlsForUser, httpChecker } = require("./helper");

app.use(cookieSession({
  name: 'session',
  keys: ["key1"]}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

const urlDatabase = {
};

const users = {
};

//Create short URL page, URL_new template
app.get("/urls/new", (req,res) => {
  if (!(users[req.session.userID])) {
    return res.redirect("/login");
  }
  let templateVars = {
    user: users[req.session.userID]
  };
  res.render("urls_new", templateVars);
});
//show short URL, URL_show template
app.get("/urls/:shortURL", (req, res) => {
  if (!(req.params.shortURL in urlDatabase)) {
    res.redirect('/urls');
  }
  
  let templateVars = {
    shortURL: req.params.shortURL ,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[req.session.userID],
  };
  res.render("urls_show", templateVars);
});
//redirect link in URL_show , link to longURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]["longURL"]);
});
//dynamic error page
app.get("/urls/error", (req, res) => {
  res.redirect("/urls/error");
});
//login, URLS_login
app.get("/login", (req, res) => {
  let templateVars = {user: users[req.session.userID]};
  res.render("urls_login", templateVars);
});
//register, URLS_register
app.get("/register", (req, res)=> {
  let templateVars = {user: users[req.session.userID]};
  res.render("urls_register", templateVars);
});
//home page, URLS_index
app.get("/urls",(req, res) => {
  let templateVars = {
    urls: urlsForUser(urlDatabase, req.session.userID),
    user: users[req.session.userID]
  };
  res.render("urls_index",templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//delete through a button, present in /urls, using URLS_index
app.delete("/urls/:shortURL", (req, res) => {
  const newObject = urlsForUser(urlDatabase, req.session.userID);
  if (!(req.params.shortURL in newObject)) {
    return res.redirect("/urls");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/");
});
//update longURL through a button , button is on urls_show
app.patch("/urls/:id", (req, res) => {
  const newObject = urlsForUser(urlDatabase, req.session.userID);
  if (!(req.params.id in newObject)) {
    let templateVars = {
      message: "You need to be logged in and visiting your own URLS to edit them",
      error: 401,
      user: undefined
    };
    return res.render("urls_error", templateVars);
  }

  urlDatabase[req.params.id]["longURL"] = httpChecker(req.body.newURL);
  res.redirect("/urls");
});
//create account ,urls_register
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const {email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = emailHelper(email, users);

  users[id] = {id, email, hashedPassword};
  
  if (email === user.email) {
    let templateVars = {
      user: undefined,
      error: 400,
      message: "That email already exists!"
    };
    
    return res.render("urls_error", templateVars);
  }

  req.session.userID = id;
  res.redirect("/urls");
});

// logout button present in header
app.post("/logout" , (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
//urls_login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  let user = emailHelper(email, users);
  if (user) {

    if (bcrypt.compareSync(password, user.hashedPassword)) {
      req.session.userID = user.id;
      return res.redirect("/urls");

      // for dynamic error page //
    } else {
      let templateVars = {
        user : undefined,
        error: 400,
        message: "Your password is incorrect!"
      };
      
      res.render("urls_error", templateVars);
    }
  } else {
    let templateVars = {
      user,
      error: 400,
      message: "That email account doesn't exist!"
    };
    
    res.render("urls_error", templateVars);
  }
});

//urls_new
app.post("/urls",(req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL : httpChecker(req.body.longURL),
    userID : req.session.userID
  };
  return res.redirect(`/urls/${shortURL}`);
});

app.get("*", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



