import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/User.vue')
                },
                {
                    path: '/product',
                    name: 'product',
                    component: () => import('@/views/Product.vue')
                },
                {
                    path: '/home/default',
                    name: 'home',
                    component: () => import('@/views/pages/home/DataView.vue')
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        }

    ]
});

export default router;
