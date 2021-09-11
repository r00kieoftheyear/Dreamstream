<template>
  <div class="home">
		<div>
	 	   <div>
	      <h2>Your latest dream</h2>
				<div v-if="!showUpdate">
          <div >
					<span><strong>Title: </strong>{{dream.title}}</span>
					<br/>
					<span><strong>Dream Type: </strong>{{dream.dreamType}}</span>
					<br/>
					<span><strong>Description: </strong>{{dream.description}}</span>
        </div>
	  			<div v-if="this.user.userId == dream.accountId">
	          <strong>Modify entries</strong>
	          <br/>
	  				<button  v-on:click="showUpdate = !showUpdate">Update dream</button>
	  				<button  v-on:click="deleteDream()">Delete dream</button>
	  			</div>
				</div>
	      <div v-else>
	        <form @submit.prevent="updateDream()">
	          <div class="row">
	            <label for="dreamTitle"><strong>Update Title</strong></label>
	            <p>Must be between 2-25 characters.</p>
	            <input class="input-area" id="dreamTitle" v-model="updatedDream.title">
	          </div>
	          <br/>
						<div class="row">
	            <label for="dream-name"><strong>Update Description</strong></label>
	            <p>Must be between 2-25 characters.</p>
	            <input class="input-area" id="dream-name" v-model="updatedDream.description">
	          </div>
						<br/>
	          <div class="row">
	            <label for="dreamType"><strong>New dreamType</strong></label>
	            <select  v-model="updatedDream.dreamType" name="dreamType" value="dreamType">
	              <option>Daydream</option>
	              <option>Lucid Dream</option>
	              <option>Nightmare</option>
	              <option>Recurring Dream</option>
								<option>Prophetic Dream</option>
								<option>Inception Dream</option>
	            </select>
	          </div>
	          <br/>
	          <input id="submit-button" type="submit" value="Update dream">
	        </form>
	        <div id="configuration-container" v-if="this.user.userId == dream.accountId">
	          <button class="user-button" v-on:click="showUpdate = !showUpdate">Cancel Update</button>
	        </div>
	      </div>
			</div>
		</div>
  </div>
</template>

<script>
const client = require('../client')

export default {
	props: ["user"],
	data() {
		return {
			dream: {
				id: this.$route.params.id,
				accountId: 0,
				title: "",
				dreamType: "",
				description: ""

			},
      updatedDream: {
        title: "",
				dreamType: "",
				description: ""

      },
      showUpdate: false,
		  errors: []
		}
	},
	created() {
		client.getDreamById(this.dream.id, (errors, dream) => {
			if (errors.length == 0) {
				this.dream = dream
      }
      else {
				this.errors = errors
			}
		})
	},
	methods: {
		deleteDream() {
			client.deleteDream(this.dream.id, this.dream.accountId, (errors) => {
				if (errors.length == 0) {
					alert("dream was deleted.")
          this.$router.push("/viewaccount/"+this.user.userId)
      	}
      	else {
					this.errors = errors

				}
			})
		},
    updateDream() {
			client.updateDream(this.dream.id, this.dream.accountId, this.updatedDream.title, this.updatedDream.dreamType, this.updatedDream.description, (errors) => {
				if (errors.length == 0) {
					alert("dream was updated.")
          this.showUpdate = false
					this.$router.push("/viewaccount/"+this.user.userId)
      	}
        else {
					this.errors = errors
				}
			})
		}
	}
}
</script>
