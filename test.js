


const urlDatabase = {
    // "b2xVn2": "http://www.lighthouselabs.ca",
    // "9sm5xK": "http://www.google.com"
    f5 : {longURL: "http://www.example.com", userID : 5},
    f6 : {longURL: "http://www.example1.com", userID : 6},
    f7 : {longURL: "http://www.example1.com", userID : 7},
    f8 : {longURL: "http://www.example4.com", userID : 5}

  
  
  };



const urlsForUser = ((database, userID) => {
    const newObj = {};
    for(const items in database) {
     const urls = database[items];
     if(urls["userID"] === userID) {
      //newArr.push(urls["longURL"]);
      newObj[items] = {
          longURL: urls["longURL"],
          userID, 
      }
  
     }
    }
    return newObj;
  });


  console.log(urlsForUser(urlDatabase, 5));
  