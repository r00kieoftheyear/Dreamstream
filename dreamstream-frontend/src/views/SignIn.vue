<template>
  <div class="login">
    <h1 class="title">Sign Into Account.</h1>
    <form class="form" @submit.prevent="loginToAccount()">
      Username: <input class="field" type="text" placeholder="Username" name="username" v-model="username" required>
      Password: <input class="field" type="password" placeholder="Password" name="password" v-model="password" required>
      <button type="submit" value="Sign In"> Sign In</button>
    </form>
    <div class="signUpLink">
      <router-link to="/signup">New here? <span class="link">Register Account</span></router-link>
    </div>
    <div v-if="0 < errors.length">
      <br/>
      <ul>
        <li v-for="error in errors" :key="error">{{error}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
const client = require('../client')

export default {
  props: ["user"],
  data() {
  return {
    username: "",
    password: "",
    errors: [],
  }
},
methods: {
  loginToAccount() {
    client.loginToAccount(this.username, this.password, (errors, id, username) => {
      if(errors.length == 0){
        alert("Login successful");
        this.user.isSignedIn = true;
        this.user.username = username;
        this.user.userId  = id;
        this.$router.push("/");
      }
      else{
        this.errors=errors;
        console.log(errors);
      }
      })
    }
  }
}
</script>

<style scoped>

  input[type=password] {
  background-image: url('../assets/user.png');
  background-position: 100px 10px;
  background-repeat: no-repeat;
  padding-left: 40px;
  }

  .signUpLink, a {
    text-decoration: none;
    color: #FAF4E6;
  }

  .link {
    color: #A0CAE8;
  }

</style>
