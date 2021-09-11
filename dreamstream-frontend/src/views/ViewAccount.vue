  <template>
  <div>
    <div id="wrap-container" >
      <h2>Viewing Account - {{account.username}}</h2>
      <div id="account-container" v-if="!showUpdate">
        <span class="userinfo"><strong>Account ID: </strong>{{account.id}}</span>
        <br/>
        <span class="userinfo"><strong>Username: </strong>{{account.username}}</span>
        <br/>
        <span class="userinfo"><strong>About you: </strong>{{account.bio}}</span>
        <br/>
        <span class="userinfo"><strong>Amount of Dreams: </strong>{{dreams.length}}</span>
        <br/>
        <div id="configuration-container" v-if="account.id == this.user.userId">
          <strong>User Configurations</strong>
          <br/>
  				<button class="user-button" v-on:click="showUpdate = !showUpdate">Update Bio</button>
  				<button class="user-button" v-on:click="deleteAccount()">Delete your Account</button>
  			</div>
      </div>
      <div id="update-container" v-else>
        <form @submit.prevent="updateAccount()">
          <div class="row">
            <label class="input-label" for="updatedBio"><strong>New Bio</strong></label>
            <p class="input-description">Max 10 characters.</p>
            <textarea class="text-area" id="updatedBio" v-model="updatedBio">Enter new bio</textarea>
          </div>
          <br/>
          <input id="submit-button" type="submit" value="Update Bio">
        </form>
        <div id="configuration-container" v-if="account.id == this.user.userId">
  				<button class="user-button" v-on:click="showUpdate = !showUpdate">Cancel Update</button>
  			</div>
      </div>
      <h2>Your Dreams</h2>
      <div>
        <div class="platform-container">
          <div v-if="dreams.length < 0">
            <p>No dreams found.</p>
          </div>
          <div v-else>
            <ul>
              <li v-for="dream in dreams" :key="dream.id">
                <router-link :to="'/viewsingledream/'+dream.id">{{dream.title}}</router-link>
              </li>
            </ul>
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
			account: {
        id: this.$route.params.id,
        username: ""
      },
      updatedBio: "",
      dreams: [],
			errors: [],
      showUpdate: false
		}
	},
	created() {
		client.getAccount(this.account.id, (errors, account) => {
			if (errors.length == 0) {
				this.account = account
      }
      else {
				this.errors = errors
			}
		}),
    client.getDreamsByAccountId(this.account.id, (errors, dreams) => {
			if (errors.length == 0) {
				this.dreams = dreams
      }
      else {
				this.errors = errors
			}
		})
  },
  methods: {
    deleteAccount() {

			client.deleteAccount(this.account.id, (errors) => {
				if (errors.length == 0) {
					alert("Your account has successfully been deleted.")
          this.user.isSignedIn = false
          this.user.username = ""
          this.user.userId = 0
          this.$router.push("/signup/")
      	}
      	else {
          console.log(errors);
					this.errors = errors
				}
			})
		},
    updateAccount() {
			client.updateAccount(this.account.id, this.updatedBio, (errors) => {
				if (errors.length == 0) {
					alert("Your bio has been updated.")
          this.showUpdate = false
          this.$router.push("/")
      	}
      	else {
					this.errors = errors
				}
			})
    }
  }
}
</script>
