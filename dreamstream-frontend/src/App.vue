<template>
  <div>
  <div id="app">
    <div id="nav">
      <router-link to="/signin">Sign In</router-link> |
      <router-link to="/">Home</router-link> |
      <router-link v-if="user.isSignedIn" :to="'/postdream'">Tell us about your dream |</router-link>
      <!-- Uneccessary page, check view account instead <router-link v-if="user.isSignedIn" :to="'/viewsingledream/'+user.userId">Your posts |</router-link> -->
      <router-link v-if="user.isSignedIn" :to="'/viewaccount/'+user.userId"> Your account |</router-link>
      <router-link to="/signup">Sign Up </router-link>
      <router-link v-if="user.isSignedIn" :to="'/signout'">| Sign Out |</router-link>

    </div>
    <div class="logo">
    <router-view :user="user"/>
    <div class="signedIn">
      <div v-if="user.isSignedIn">
        <img class="logoOpen" src="@/assets/logoOpen.png" />
      </div>
      <div v-else>
        <img class="logoShut" src="@/assets/logoShut.png" />
      </div>
    </div>
    </div>
  </div>
</div>
</template>

<script>
const client = require('./client');

module.exports = {
  data(){
    return {
      user: {
        isSignedIn: false,
        username: "",
        userId: 0
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');



#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #FAF4E6;
}

h1 {
  font-weight: semi-bold;
}
/* logo */
#app .logo img {
  max-width: 9vw;;
}

.logo img{
  margin: auto;
  display: flex;
  flex-direction: row;
  object-fit: contain;
  margin-top: 3vh;
}


/* center form*/
.form {
  width: 15vw;
  margin: auto;
  display: flex;
  flex-direction: column;

}

.form, input {
  margin-bottom: 3vh;

}

.form select {
  padding: 16px 20px;
  margin-top: 5%;
  border: none;
  background-color: #302b63;
  color: white;
  font-size: 20px;
}

.login {
 margin: auto;
 margin-top: 8vh;
}

.login, .title {
  margin-bottom: 3%;
}
.input, .field {
  padding: 1.5vh;
  margin-top: 5%;
  background-color: #302b63;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  text-align: center;
}

/*big field*/

.input, .bigField {
  padding: 2vh;
  height: 5vh;
  margin-top: 5%;
  color: white;
  border: none;
  border-radius: 20px;
  background-color: #302b63;
  font-size: 15px;
  text-align: center;
}

/*buttons*/

 button {
  font-family: 'Poppins', sans-serif;
  background-color: #464677;
  color: #FAF4E6;
  padding: 1vh;
  border: none;
  transition: 0.7s;
  border-radius: 20px;
  font-size: 15px;
}

  button:hover {
    background-color: #5B426E;
  }


/*background*/
html {
  background-image: #5B426E;  /* fallback for old browsers */
  background-image: -webkit-linear-gradient(to right, #679BBF, #5B426E);  /* Chrome 10-25, Safari 5.1-6 */
  background-image: linear-gradient(to right, #679BBF, #5B426E); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  height: 100%;
  display: grid;
}

#nav {
  margin: 30px;
}

#nav a {
  color: #eaeaea;
  padding: 10px;
  font-size: 20px;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #9b9bc6;
}

#nav a:hover {
  color: #d9b3ff;
  font-size: 22px;
}
</style>
