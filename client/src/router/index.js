import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/trainees',
      name: 'TraineesList',
      component: () => import('../views/TraineesList.vue')
    },
    {
      path: "/trainees/:id",
      name: "TraineeProfile",
      component: () => import("@/views/TraineeProfile.vue"),
    },
    {
      path: '/trainees/create',
      name: 'CreateTrainee',
      component: () => import('../views/CreateTrainee.vue')
    },
    {
      path: "/trainees/:id/edit",
      name: "EditTrainee",
      component: () => import("@/views/EditTrainee.vue"),
    },


  ]
})

export default router
