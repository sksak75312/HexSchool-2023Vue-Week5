import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/products',
      component: () => import('@/views/ProductsView.vue'),
    },
  ],
});

export default router;
