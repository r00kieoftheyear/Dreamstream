<template>
 <div>
   <h1>Tell us about your most recent dream</h1>
   <form class="form" @submit.prevent="createDream()">
     Title: <input class="field" type="text" placeholder="Give your dream a title" name="title" v-model="title" required><br>
     Dream Type:<select  v-model="dreamType" name="dreamType" value="dreamType">
                  <option>Daydream</option>
                  <option>Lucid Dream</option>
                  <option>Nightmare</option>
                  <option>Recurring Dream</option>
                 <option>Prophetic Dream</option>
                 <option>Inception Dream</option>
              </select></br>
     Description: <input class="bigField" type="text" placeholder="Description" name="description" v-model="description" required><br>
     <button type="submit" value="Submit">Post Dream</button>
   </form>
   <div v-if="user.isSignedIn == false">
      <router-link to="/signin">You need to log in to post a dream </router-link>
   </div>
   <div v-else>
      You are logged in as {{user.username}}
   </div>
 </div>
</template>


<script>
const client = require('../client')
export default {
 props: ["user"],
 data(){
   return{
     accountId: this.user.userId,
     title: "",
     dreamType: "",
     description: "",
     errors:[]
   }
 },
 methods: {
   createDream() {
      client.createDream(this.accountId, this.title, this.dreamType, this.description, (errors, id) => {
         if(errors.length == 0) {
            alert("Your dream has been published");
            this.$router.push("/viewsingledream/"+this.user.userId)
         }
         else {
            console.log(errors)
         }
         })
      }
   }
}
</script>
