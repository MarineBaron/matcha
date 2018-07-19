import Home from '../Components/Home/Home.vue'
import About from '../Components/Pages/About.vue'
import LoginPage from '../Components/Authentification/Login/LoginPage.vue'
import RegisterPage from '../Components/Authentification/Register/RegisterPage.vue'
import ConfirmationPage from '../Components/Authentification/Confirmation/ConfirmationPage.vue'
import PasswordResetPage from '../Components/Authentification/PasswordReset/PasswordResetPage.vue'
import ProfilePage from '../Components/User/Profile/ProfilePage.vue'
import UserPage from '../Components/User/User/UserPage.vue'
import SearchContent from '../Components/User/Search/SearchContent.vue'
import SearchSidebar from '../Components/User/Search/SearchSidebar.vue'
import SearchPage from '../Components/User/Search2/SearchPage.vue'
import AdminPage from '../Components/Admin/AdminPage.vue'

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

const ifAdmin = (to, from, next) => {
  if(store.getters.isAuthenticated || store.getters.getUsername === 'admin' ) {
    next()
    return
  }
  next('/')
}

export default [
	{
    path: '/',
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
    path: '/confirmation/:username/:token',
    component: ConfirmationPage,
    meta: {},
  },
  {
    path: '/passwordreset/:username/:token',
    component: PasswordResetPage,
    meta: {},
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
    component: SearchPage,
    meta: {},
    beforeEnter: ifAuthenticated
  },
  {
    path: '/user/:username',
    component: UserPage,
    meta: {}
  },
  {
    path: '/admin',
    component: AdminPage,
    beforeEnter: ifAdmin,
    meta: {}
  }
]
