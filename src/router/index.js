import { createRouter, createWebHistory } from 'vue-router'
import MinMaxView from '@/views/MinMaxView.vue'
import Test from '@/views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MinMaxView,
    },
    {
      path: "/test",
      component: Test,
    }
  ],
})

export default router
