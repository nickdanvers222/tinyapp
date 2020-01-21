const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("youre in the root!");
});

app.get("/urls",(req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index",templateVars);
});
app.get("/urls/new", (req,res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
    let templateVars = {shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show", templateVars)
});
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n")
});
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls/");
})
app.post("/urls", (req, res ) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


const generateRandomString = () => {
  newString = (Math.random().toString(36)).substr(2,6);
  return newString;
  
}
