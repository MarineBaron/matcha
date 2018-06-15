import Home from '../Components/Home/Home.vue'
import About from '../Components/Pages/About.vue'
import LoginPage from '../Components/Authentification/Login/LoginPage.vue'
import RegisterPage from '../Components/Authentification/Register/RegisterPage.vue'
import ProfilePage from '../Components/User/Profile/ProfilePage.vue'
import SearchContent from '../Components/User/Search/SearchContent.vue'
import SearchSidebar from '../Components/User/Search/SearchSidebar.vue'
import ForumContent from '../Components/Forum/ForumContent.vue'
import ForumSidebar from '../Components/Forum/ForumSidebar.vue'

import store from '../Store/store'

const ifNotAuthenticated = (to, from, next) => {
  if(!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if(store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default [
	{
    path: '/',
    name: 'Home',
    component: Home,
    meta: {}
  },
	{
    path: '/about',
    components: {default: About, sidebar: About},
    meta: {
      sidebar: true
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/login',
    component: LoginPage,
    meta: {},
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/register',
    component: RegisterPage,
    meta: {},
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/profile',
    component: ProfilePage,
    meta: {},
    beforeEnter: ifAuthenticated
  },
  {
    path: '/search',
    components: {default: SearchContent, sidebar: SearchSidebar},
    meta: {
      sidebar: true
    }
  },
  {
    path: '/forum',
    components: {default: ForumContent, sidebar: ForumSidebar},
    meta: {
      sidebar: true
    },
    beforeEnter: ifAuthenticated
  }
]
