<template>
  <div class="login">
    <h1 class="title">Create a new account</h1>
    <form class="form" @submit.prevent="createAccount()">
      Username: <input class="field" type="text" placeholder="Username" name="username" v-model="username" required>
      Password: <input class="field" type="text" placeholder="Password" name="password" v-model="password" required>
      <button type="submit" value="Create Account">Create Account</button>
    </form>
  </div>
</template>

<script>
const client = require('../client.js');

export default {
  data() {
  return{
    username: "",
    password: "",
    errors: []
  }
},
methods: {
  createAccount(){
    this.errors = [];
    client.createAccount(this.username, this.password, (errors, id) => {
      if(errors.length == 0){
        alert("Account created!");
        this.errors = [];
        this.$router.push("/signin");
      }
      else{
        console.log(errors)
      }
    })
  }
}
}
</script>
