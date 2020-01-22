const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

///
const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  


};
///
const users = {
};
//
///
app.get("/", (req, res) => {
  res.send("youre in the root!");
});

//RENDERS

app.get("/login", (req, res) => {
  let templateVars = {user: users[req.cookies.user_id]}
  res.render("urls_login", templateVars)
});

app.get("/register", (req, res)=> {
   let templateVars = {user: users[req.cookies.user_id]};
   res.render("urls_register", templateVars)
 });

 app.get("/urls/error", (req, res) => {
   res.redirect("/urls/error");
 });

app.get("/urls/new", (req,res) => {
  if(!(users[req.cookies.user_id])) {
    res.redirect("/login")
  }
  let templateVars = {
    user: users[req.cookies.user_id]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL ,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars)
});

 app.get("/urls",(req, res) => {
     let templateVars = {
    urls: urlsForUser(urlDatabase, req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  res.render("urls_index",templateVars);
});
//RENDERS END
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});
 // GETS END

 // POSTS START
app.post("/register", (req, res) => {
const id = generateRandomString();
const {email, password } = req.body;
const user = emailHelper(email, users);

//
if(email.length === 0 || password.length === 0) {
let templateVars = {
  user: emailHelper(email, users),
  error: 403,
  message: "You've left the email or password field empty!"
}
res.status(403);
res.render("urls_error", templateVars)
}
//
users[id] = {id, email, password};
//
  if (email === user.email) {
    let templateVars = {
    user: emailHelper(email, users),
    error: 400,
    message: "That email already exists!"
    }
    res.status(400);
    res.render("urls_error", templateVars);
    }
//
res.cookie("user_id", id);
res.redirect("/urls")
});
//

// app.post("/urls/:shortURL/update", (req, res) => {
//   urlDatabase[req.params.shortURL] = {longURL : req.body.newURL, userID : req.params.id}
//   //urlDatabase[req.params.shortURL] = req.body.newURL;
//   res.redirect("/urls",)
// });
app.post("/logout" , (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let user = emailHelper(email, users);
  if(user) {
    if(password === user.password) {
      res.cookie("user_id",user.id);
      return res.redirect("/urls");

    } else {
      let templateVars = {
        user,
        error: 400,
        message: "Your password is incorrect!"
      }
      res.status(400);
      res.render("urls_error", templateVars);
    }
  } else {
    let templateVars = {
      user,
      error: 400,
      message: "That email account doesn't exist!"
    }
     res.status(400);
     res.render("urls_error", templateVars);
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls/");
})
app.post("/urls", (req, res ) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL : req.body.longURL,
    userID : req.cookies.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});
app.post("/urls/:id", (req, res) => { 
  urlDatabase[req.params.id]["longURL"] = req.body.newURL;
  console.log(urlDatabase);
  res.redirect("/urls")
});





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


const generateRandomString = () => {
  newString = (Math.random().toString(36)).substr(2,6);
  return newString;
  
}
const emailHelper = (email, users) => {
  for(const ids in users) {
  const user = users[ids];
    if(email === user.email) {
      return user;
    }
  }
  return false;
};

const urlsForUser = ((database, userID) => {
  const newObj = {};
  for(const items in database) {
   const urls = database[items];
   if(urls["userID"] === userID) {
    newObj[items] = {
      longURL: urls["longURL"],
      userID, 
  }
   }
  }
  return newObj;
});

console.log(urlsForUser(urlDatabase, 5))

