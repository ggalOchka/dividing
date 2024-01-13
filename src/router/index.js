// Composables
import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/components/MainPage'
import DishPage from '@/components/DishPage'
import CalculationPage from '@/components/CalculationPage'
const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
  },
  {
    path: '/dish',
    name: 'dish',
    component: DishPage
  },
  {
    path: '/calculation',
    name: 'calculation',
    component: CalculationPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
