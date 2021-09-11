const jwtDecode = require('jwt-decode');

//log into account 🔑

exports.loginToAccount = function(username, password, callback){
  const req = new XMLHttpRequest()
	req.open("POST", "http://localhost:3000/tokens")
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	req.send("grant_type=password&username="+encodeURIComponent(username)+"&password="+encodeURIComponent(password))

	req.addEventListener("load", () => {

		switch(req.status){
			case 200:
				var body = JSON.parse(req.responseText)
				const idToken = body.id_token
				accessToken = body.access_token
				const userInfo = jwtDecode(idToken)
				const id = userInfo.sub
				const username = userInfo.username
				callback([], id, username)
        console.log("You have successfully logged in");
				break;
			case 400:
				var body = JSON.parse(req.responseText);
				callback([body.error]);
				break;
      case 404:
        var body = JSON.parse(req.responseText);
        callback([body.error])
			case 500:
				callback(["Internal Server Issue has occurred while trying to log in"])
				break;
			default:
				callback(["An unknown error has occurred while trying to log in"])
		}
	})
}

// logout of account 🔐

exports.signOut = function(callback) {
  accessToken = null;
}

//getAllAccounts 🧑‍🤝‍🧑

exports.getAllAccounts = function(callback) {
  const request = new XMLHttpRequest()
  req.open("GET", "http://localhost:3000/accounts");
  req.send();

  req.addEventListener("load", () => {

    switch(req.status){
      case 200:
        const bodyAsString = req.responseText;
        const accounts = JSON.parse(bodyAsString);
        callback([], accounts)
        console.log("All accounts fetched successfully")
        break;
      case 404:
        callback(["Accounts do not exist"]);
        break;
      case 500:
        callback(["An error occurred while fetching accounts"]);
        break;
      default:
        callback(["Unknown error occurred while fetching accounts"]);
    }
  })
}

//get account based on given id 🧍

exports.getAccount = function(id, callback){
  const req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/accounts/" +id)
  req.send();

  req.addEventListener("load", () => {

    switch(req.status){
      case 200:
        const bodyAsString = req.responseText;
        const account = JSON.parse(bodyAsString)
        callback([], account);
        console.log("Account fetched");
        break;
      case 404:
        callback(["Account could not be found"]);
        break;
      case 500:
        callback(["An error occurred while fetching singular account"]);
        break;
      default:
        callback(["An unknown error has occurred"]);
    }
  })
}

//create account 🌱

exports.createAccount = function(username, password, callback){
  const account = {
    username,
    password
  }
  const req = new XMLHttpRequest()
  req.open("POST", "http://localhost:3000/accounts");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(account));

  req.addEventListener("load", () => {

    switch(req.status){
      case 201: //created
        const location = req.getResponseHeader("Location"); // indicates the URL to redirect a page to
        const sections = location.split("/");
        callback([], sections[2]);
        console.log("Account has been created");
        break;
      case 400:
        callback(["Username or Password is too long or short"]);
        break;
      case 500:
        callback(["Internal server error when creating an account"]);
        break;
      default:
        callback(["An unknown error has occurred while creating account"]);
    }
  })
}

//update account bio

exports.updateAccount = function(id, updatedBio, callback){
  const account = {
    id,
    updatedBio
  }

  const req = new XMLHttpRequest();
  req.open("PUT", "http://localhost:3000/accounts/"+id);
  req.setRequestHeader("Content-type", "application/json");
  req.setRequestHeader("Authorization", "Bearer "+accessToken);
  req.send(JSON.stringify(account))

  req.addEventListener("load", () => {

    switch(req.status){
      case 204:
        const location = req.getResponseHeader("Location");
        callback([], location);
        console.log("Account bio updated");
        break;
      case 400:
        callback(["Bio too long"]);
      case 401:
        callback(["Unauthorized request, you must be signed in to update bio"]);
        break;
      case 500:
        callback(["Internal server error while updating bio"]);
        break;
      default:
        callback(["An unknown error has occurred while updating bio"]);
    }
  })
}

//delete account
exports.deleteAccount = function(id, callback){
  const req = new XMLHttpRequest();
  req.open("DELETE", "http://localhost:3000/accounts/"+id);
  req.setRequestHeader("Authorization", "Bearer "+accessToken);
  req.send();

  req.addEventListener("load", () => {

    switch(req.status){
      case 204:
        callback([]);
        console.log("Account deleted");
        break;
      case 401:
        callback(["You are not authorized to delete account"]);
        break;
      case 404:
        callback(["Account to be deleted could not be found"]);
        break;
      case 500:
        callback(["Internal server error has occurred while deleting account"]);
        break;
      default:
        callback(["An unknown error has occurred while deleting account"]);
    }
  })
}

//get singular dream based on id

exports.getDreamById = function(id, callback){
  const req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/dreams/"+id)
  req.send()

  req.addEventListener("load", () => {

    switch(req.status) {
      case 200:
        const bodyAsString = req.responseText;
        const dream = JSON.parse(bodyAsString)
        callback([], dream);
        console.log("Dream fetched");
        break;
      case 404:
        callback(["Dream not found"]);
        break;
      case 500:
        callback(["internal server error occurred while fetching dream"]);
        break;
      default:
        callback(["An unknown error has occurred while fetching dream"]);
    }
  })
}

//get dreams by accountId

exports.getDreamsByAccountId = (accountId, callback) => {

	const req = new XMLHttpRequest()
	req.open("GET", "http://localhost:3000/dreams?accountId="+accountId)
	req.setRequestHeader("Content-type", "application/json")
	req.send()

	req.addEventListener("load", () => {

		switch(req.status) {
			case 200:
				const bodyAsString = req.responseText
				const dreams = JSON.parse(bodyAsString)
				callback([], dreams)
        console.log("Dreams fetched by account id")
				break;
			case 404:
				callback(["The server could not find any dreams by account id."])
				break;
			case 500:
				callback(["Internal Server Issues occurred while fetching dream by account id."])
				break;
			default:
				callback(["An unknown error has occurred while fetching dream by account id."])
		}
	})
}

//getAllDreams 🌜

exports.getAllDreams = function(callback){
  const req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/all-dreams")
  req.send();

  req.addEventListener("load", () => {

    switch(req.status){
      case 200:
        const bodyAsString = req.responseText;
        const dreams = JSON.parse(bodyAsString);
        callback([], dreams);
        console.log("Dreams fetched")
        break
      case 404:
        callback(["Dreams doesn't exist"]);
        break;
      case 500:
        callback(["Internal server error while trying to fetch dreams"]);
        break;
      default:
        callback(["Unknown error occurred while trying to fetch dreams"]);
    }
  })
}

//create dream

exports.createDream = function(accountId, title, dreamType, description, callback){
  const dream = {
    accountId,
    title,
    dreamType,
    description
  };
  const req = new XMLHttpRequest();
  req.open("POST", "http://localhost:3000/dreams")
  req.setRequestHeader("Content-type", "application/json")
  req.setRequestHeader("Authorization", "Bearer "+accessToken)
  req.send(JSON.stringify(dream))

  req.addEventListener("load", () => {

    switch(req.status) {
      case 201:
        const location = req.getResponseHeader("Location");
        callback([], location);
        console.log("Dream added");
        break;
      case 400:
        callback(["Please enter fields correctly"]);
        break;
      case 401:
        callback(["You are not authorized to add a dream"]);
        break;
      case 500:
        callback(["Internal server issue occurred while trying to add dream"]);
        break;
      default:
        callback(["Unknown issue occurred while trying to add dream"]);
    }
  })
}

//update dream
exports.updateDream = function(id, accountId, title, dreamType, description, callback){
  const dream = {
    id,
    accountId,
    title,
    dreamType,
    description
  }
  const req = new XMLHttpRequest();
  req.open("PUT", "http://localhost:3000/dreams/"+id)
  req.setRequestHeader("Content-type", "application/json")
  req.setRequestHeader("Authorization", "Bearer "+accessToken)
  req.send(JSON.stringify(dream))

  req.addEventListener("load", () => {

    switch(req.status){
      case 204:
        const location = req.getResponseHeader("Location");
        callback([], location);
        console.log("Dream updated");
        break;
      case 400:
        callback(["Please fill in all fields"]);
        break;
      case 401:
        callback(["Unauthorized request, you must be signed in to update dream"]);
        break;
      case 500:
        callback(["Internal server error while updating dream"]);
        break;
      default:
        callback(["An unkown error has occurred while updating dream"]);
    }
  })
}

//delete dream
exports.deleteDream = function(id, accountId, callback){
  const dream = {
    accountId
  }
	const req = new XMLHttpRequest()
	req.open("DELETE", "http://localhost:3000/dreams/"+id)
	req.setRequestHeader("Content-type", "application/json")
	req.setRequestHeader("Authorization", "Bearer "+accessToken)
	req.send(JSON.stringify(dream))

	req.addEventListener("load", () => {

		switch(req.status) {
			case 204:
				callback([])
        console.log("Dream successfully deleted");
				break;
			case 401:
				callback(["You are not authorized to delete dream"])
				break;
			case 404:
				callback(["This dream has already been deleted."])
				break;
			case 500:
				callback(["Internal Server Issue occurred while trying to delete dream"])
				break;
			default:
				callback(["An unknown error has occurred while trying to delete dream"])
		}
	})
}
