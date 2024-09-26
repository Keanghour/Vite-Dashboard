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
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'user',
                    name: 'user',
                    component: () => import('@/views/User.vue')
                },
                {
                    path: 'product',
                    name: 'product',
                    component: () => import('@/views/Product.vue')
                },
                {
                    path: 'order',
                    name: 'order',
                    component: () => import('@/views/Order.vue')
                },
                {
                    path: 'report',
                    name: 'report',
                    component: () => import('@/views/Report.vue')
                },
                {
                    path: 'wallet',
                    name: 'wallet',
                    component: () => import('@/views/Wallet.vue')
                },
                {
                    path: 'notification',
                    name: 'notification',
                    component: () => import('@/views/Notification.vue')
                },
                {
                    path: 'setting',
                    name: 'setting',
                    component: () => import('@/views/Setting.vue')
                }
            ]
        },
        {
            path: '/auth',
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/pages/auth/Login.vue')
                }
            ]
        },
        {
            path: '/products',
            component: AppLayout,
            children: [
                {
                    path: 'listproduct',
                    name: 'listproduct',
                    component: () => import('@/views/pages/products/ListProduct.vue')
                },
                {
                    path: 'addproduct',
                    name: 'addproduct',
                    component: () => import('@/views/pages/products/AddProduct.vue')
                },
                {
                    path: 'stock',
                    name: 'stock',
                    component: () => import('@/views/pages/products/Stock.vue')
                }
            ]
        }

    ]
});

export default router;
