import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SignUp from './views/Signup.vue'
import SignIn from './views/SignIn.vue'
import SignOut from './views/Signout.vue'
import PostDream from './views/Postdream.vue'
import ViewSingleDream from './views/Viewsingledream.vue'
import ViewAccount from './views/ViewAccount.vue'
// import ViewDreams from './views/Viewdreams.vue' - moved to home

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/signout',
      name: 'signout',
      component: SignOut
    },
    {
      path: '/postdream',
      name: 'postdream',
      component: PostDream
    },
    {
      path: '/viewsingledream/:id',
      name: 'viewsingledream',
      component: ViewSingleDream
    },
    {
      path: '/viewaccount/:id',
      name: 'viewaccount',
      component: ViewAccount
    }
  ]
})
