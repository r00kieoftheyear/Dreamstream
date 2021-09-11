<template>
  <div>
    <div class="loginStatus" v-if="user.isSignedIn">
      You are logged in as {{user.username}}.
      <br/>
    <button class="button" v-on:click="signOut()" >Sign Out</button>
    </div>
    <div class="loginStatus" v-else>
      You are not signed in currently.
        </br></br>
      <router-link to="/signup">Create Account</router-link>
        </br></br>
      <router-link to="/signin">Log In</router-link>
    </div>
  </div>
</template>

<script>
const client = require('../client');

export default {
  props: ["user"],
  data() {
  return{
    isSignedIn: false
  }
},

methods: {
  signOut(){
      client.signOut()
      this.user.isSignedIn = false
      this.user.username = ""
      this.user.userId = 0
    }
  }
}
</script>
