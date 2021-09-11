<template>
  <div class="home">
    <h1>Welcome to Dreamstream</h1>
    <h2>All submitted dreams</h2>
    <div v-for= "dream in dreams" :key="dream.id">
      <div>
        <span><h3>Title: {{dream.title}}</h3></span></br>
        <span><strong>Dream Type: </strong> <i>{{dream.dreamType}}</i></span></br></br>
        <span><strong>Description: </strong>{{dream.description}}</span></br></br>
      </div>
  </div>
  </div>
</template>



<script>
export default {
  data() {
    return{
      dreams: [],
      errors: [],
    }
  },

  created() {
    const client = require('../client')
    client.getAllDreams((errors, dreams) => {
      if(errors.length == 0){
        this.dreams = dreams
      }
      else{
        console.log(errors)
      }
    })
  }
}
</script>
