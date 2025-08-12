import { createRouter, createWebHistory } from 'vue-router'
import Incomes from '../components/Incomes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'incomes',
      component: Incomes,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../components/Orders.vue'),
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../components/Sales.vue'),
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => import('../components/Stocks.vue'),
    },
  ],
})

export default router
