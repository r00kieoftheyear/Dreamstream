const bcrypt = require('bcryptjs');
const sqlite = require('sqlite3');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = new sqlite.Database("dreamstreamdatabase.db");

const jwt = require('jsonwebtoken');
const jwtSecret = "secretToken";

app.use(express.json());

// body parsing middleware
app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded


//enable CORS
app.use(function(req, res, next){
        res.setHeader("Access-Control-Allow-Origin", "*");
    	res.setHeader("Access-Control-Allow-Methods", "*");
    	res.setHeader("Access-Control-Allow-Headers", "*");
    	res.setHeader("Access-Control-Expose-Headers", "Location");
	    next();
    })


db.run("PRAGMA foreign_keys = ON")


//accounts
db.run(`
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT,
		password TEXT,
        bio TEXT,
		CONSTRAINT uniqueUsername UNIQUE(username)
	)
`)

//login to account 💻

app.post("/tokens", (req, res) => {

      const grant_type = req.body.grant_type
      const username = req.body.username
      const enteredPassword = req.body.password
      let errors = [];

      const query = "SELECT * FROM accounts WHERE username = ?";
      const values = [username];

      if (grant_type != "password") {
        res.status(400)
      }
      else {
        db.get(query, values, function(error, account) {
          if (!account) {
            res.status(404).json({error: "Account does not exist."})
           }
           else if(bcrypt.compareSync(enteredPassword, account.password)){
            const made_accessToken = {
              accountId: account.id
            }
            const made_idToken = {
              sub: account.id,
              username: account.username
            }
            const accessToken = jwt.sign(made_accessToken, jwtSecret)
            const idToken = jwt.sign(made_idToken, jwtSecret)
    				errors = [];
    				res.status(200).json({
              access_token: accessToken,
              id_token: idToken
            })
          }
         else {
        res.status(400).json({error: "Password incorrect."})
        }
      })
    }
    if (0 < errors.length) {
    res.status(400).json(errors)
    return
 }
})

//fetch account based on given id

app.get('/accounts/:id', (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM accounts WHERE id = ?";
    const values = [id];
    db.get(query, values, (error, account) => {
        if(error){
            res.status(500).end();
        }else if(!account){
            res.status(404).end();
        }else{
            res.status(200).json(account);
        }
    })
});

//fetch all accounts

app.get('/accounts', (req, res) => {
    console.log('getting accounts');
    const query = "SELECT * FROM accounts ORDER BY username";
    console.log('making query');
    db.all(query, function(error, accounts){
        if (error) {
      res.status(500).end()
    }else{
            res.status(200).json(accounts);
        }
    })
});


// password and username constraints

const MIN_USERNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 10;
const MAX_USERNAME_LENGTH = 10;

//create new account

app.post("/accounts", (req,res) => {
    const account = req.body;
    const hashingRounds = 10;
    const passwordToHash = account.password;
    const hashValue = bcrypt.hashSync(passwordToHash, hashingRounds);
    const bio = "Bio has not been entered"
    const query = "INSERT INTO accounts (username, password, bio) VALUES (?, ?, ?)";
    const values = [account.username, hashValue, bio];

    if(account.username.length < MIN_USERNAME_LENGTH || account.username == "") {
        res.status(400).end();
        return
    }
    else if(account.password.length < MIN_PASSWORD_LENGTH || account.password == "") {
        res.status(400).end();
        return
    }
    else if(account.username.length > MAX_USERNAME_LENGTH) {
        res.status(400).end();
        return
    }
    else if(account.password.length > MAX_PASSWORD_LENGTH) {
        res.status(400).end();
        return
    }
    else {
    db.run(query, values, (error) => {
        if(error){
            res.status(500).end();
            return
        }
        else{
            const id = this.lastID;
            res.header("Location", "/accounts/"+id);
            res.status(201).end();
            }
        })
    }
});

const MAX_BIO_LENGTH = 200;

//update account bio

app.put("/accounts/:id", (req, res) => {
    const bio = req.body.updatedBio
    const id = req.params.id
    let tokenKey = null;

    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader.substr("Bearer ". length);
        tokenKey = jwt.verify(accessToken, jwtSecret)
    }
    catch(error) {
        res.status(401).end()
        console.log("You are not authorized to update bio");
        return
    }

    if(tokenKey.accountId == id){
        if(bio.length > MAX_BIO_LENGTH){
            res.status(400).end();
            console.log("Bio must be under 200 characters");
        }
        else{
          const query = "UPDATE accounts SET bio = ? WHERE id = ?"
          const values = [bio, id]

          db.run(query, values, (error) => {
            if (error) {
              res.status(500).end();
              console.log("An internal server error occurred while updating bio");
            }
            else {
              res.status(204).end();
              console.log("Bio changed")
            }
          })
        }
      }
      else {
          res.status(401).end();
          console.log("You are not authorized to update username");
      }
})


//delete account

app.delete("/accounts/:id" , (req, res) => {
    const id = req.params.id
    let tokenKey = null

    try {
        const authorizationHeader = req.get("Authorization")
        const accessToken = authorizationHeader.substr("Bearer ".length)
        tokenKey = jwt.verify(accessToken, jwtSecret)
    }
    catch(error) {
    res.status(401).end()
    return
  }

  if(tokenKey.accountId == id) {
    const query = "DELETE FROM accounts WHERE id = ?";
    const values = [id];

    db.run(query, values, (error) => {
        if(error){
            res.status(500).end();
            console.log("Could not delete account");
        }
        else if(!account){
            res.status(404).end();
        }
  		else {
            res.status(204).end();
            console.log("Account deleted");
  		}
  	})
  }
  else {
    res.status(401).end();
  }
})

//dreams
db.run(`
	CREATE TABLE IF NOT EXISTS dreams (
		id INTEGER PRIMARY KEY,
		accountId INTEGER,
		title TEXT,
		description TEXT,
		dreamType TEXT,
		FOREIGN KEY(accountId) REFERENCES accounts(id)
	)
`);

//fetch all dreams

app.get('/all-dreams', (req, res) => {
    const query = "SELECT * FROM dreams ORDER BY title";

    db.all(query, function(error, dreams){
        if(!dreams){
            res.status(404).end();
        }
        else if(error){
            res.status(500).end();
        }
        else{
            res.status(200).json(dreams);
        }
    })
});

//fetch single dream from account

app.get('/dreams/:id', (req, res) => {
    const id = req.params.id;
    const query = "SELECT id, accountId, title, description, dreamType FROM dreams WHERE id = ?";
    const values = [id];

    db.get(query, values, (error, dream) => {
        if(error){
            res.status(500).end();
            console.log("Internal server error from app.get while fetching dream");
        }else if(!dream){
            res.status(404).end();
            console.log("dream not found");
        }else{
            res.status(200).json(dream);
        }
    })
});

// fetch dreams by account id

app.get("/dreams", (req, res) => {
  const id = req.query.accountId;
  const query = "SELECT * FROM dreams WHERE accountId = ?";
  const values = [id];

  db.all(query, values, (error, dream) => {
    if (error) {
      res.status(500).end();
    }
    else if (!dream) {
      res.status(404).end();
    }
    else {
      res.status(200).json(dream);
    }
  })
})

// dream constraints

const MIN_DREAMDESC_LENGTH = 5;
const MAX_DREAMDESC_LENGTH = 1400;

//create dream

app.post('/dreams', (req,res) => {
    let tokenKey = null

    try{
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader.substr("Bearer ".length);
        tokenKey = jwt.verify(accessToken, jwtSecret);
    }
    catch(error){
        res.status(401).end();
        return
    }
    if(tokenKey){
    const dream = req.body;
    const query = "INSERT INTO dreams (accountId, title, description, dreamType) VALUES (?, ?, ?, ?)";
    const values = [dream.accountId, dream.title, dream.description, dream.dreamType];

    if(dream.description.length < MIN_DREAMDESC_LENGTH || dream.description == ""){
        res.status(400).end();
        console.log("Dream description must be longer than 5 characters");
        return
    }
    else if(dream.title == "") {
        res.status(400).end();
        console.log("Please enter a dream title");
        return
    }
    else if(dream.description.length > MAX_DREAMDESC_LENGTH){
        res.status(400).end();
        console.log("Description exceeds the 1400 character limit");
    }
    else {
        db.run(query, values, (error) => {
        if(error){
            res.status(500).end();
            console.log("Could not create dream");
            console.log(error);
        }
        else {
            const id = this.lastID;
            res.status(201).end();
            console.log('Dream submitted');
          }
        })
      }
    }
    else {
        res.status(401).end();
    }
})


//update dream
app.put('/dreams/:id', (req, res) => {
    const dream = req.body;
    const id = req.params.id;
    let tokenKey = null;

    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader.substr("Bearer ".length);
        tokenKey = jwt.verify(accessToken, jwtSecret)
    }
    catch(error) {
        res.status(401).end()
        return
    }

    if(tokenKey.accountId == dream.accountId){
        const query = "UPDATE dreams SET accountId = ?, title = ?, dreamType = ?, description = ? WHERE id = ? ";
    	const values = [dream.accountId, dream.title, dream.dreamType, dream.description, id];

        if (dream.description.length < MIN_DREAMDESC_LENGTH || dream.description == "") {
          res.status(400).end();
          console.log("Please enter description");
        }
        else if (dream.title == "" || dream.dreamType == "") {
          res.status(400).end();
          console.log("Please enter a title and a dream type");
        }
        else {
          db.run(query, values, (error) => {
            if (error) {
              res.status(500).end();
              console.log("Internal server error has occurred while trying to update dream");
            }
            else {
              res.status(204).end();
              console.log("Request to update dream accepted");
        }
      })
    }
  }
  else {
    res.status(401).end();
    console.log("Unauthorized attempt to update dream");
  }
});

//delete dream

app.delete('/dreams/:id', (req, res) => {
    const dream = req.body;
    const id = req.params.id;
    let tokenKey = null;

    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader.substr("Bearer ".length);
        tokenKey = jwt.verify(accessToken, jwtSecret);
    }
    catch(error) {
        res.status(401).end();
        console.log("Unauthorized deletion");
        return
    }

    if(tokenKey.accountId == dream.accountId) {

    const query = "DELETE FROM dreams WHERE id = ?";
    const values = [id];

    db.run(query, values, (error) => {
        if(error){
            res.status(500).end();
        }
        else if(!dream){
            res.status(404).end();
        } else{
            res.status(204).end()
        }
      })
    }
    else{
        res.status(401).end();
    }
})


const port = process.env.PORT || 3000;
//const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
