<template>
  <div class="home">
    <div class="dreamStream">
      <h2>All submitted dreams</h2>
      <div>
        <ul>
			    <li v-for="dream in dreams" :key="dream">{{dream.title}}</li>
		    </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      dreams: {
        id: this.$route.params.id,
        accountId: 0,
        title: "",
        description: "",
        dreamType: ""
      },
      errors: []
    }
  },
  created() {
    const client = require('../client');
    client.getAllDreams((errors, dreams) => {
      if(errors.length == 0){
        this.dreams = dreams
        alert("dreams fetched");
      }
      else {
        this.errors = errors
      }
    })
  }
}
</script
