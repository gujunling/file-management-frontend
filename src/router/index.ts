import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../components/Home.vue'

const routes: Array<RouteRecordRaw> = [
  // { path: '/', name: 'ExpHome', component: Home },
  {
    path: '/',
    name: 'UploadFile',
    component: () => import('../components/upload/uploadFile.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory('/up'),
  routes
})

export default router
