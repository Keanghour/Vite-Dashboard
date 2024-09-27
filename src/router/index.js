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
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true } // Add meta field for authentication
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
                },
                {
                    path: 'error',
                    name: 'error',
                    component: () => import('@/views/pages/auth/Error.vue')
                },
                {
                    path: 'access',
                    name: 'access',
                    component: () => import('@/views/pages/auth/Access.vue')
                }
            ]
        },
        {
            path: '/pages',
            children: [
                {
                    path: 'empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: 'notfound',
                    name: 'notfound',
                    component: () => import('@/views/pages/NotFound.vue')
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

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Check if the token exists

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' }); // Redirect to login if not authenticated
    } else {
        next(); // Proceed to the route
    }
});

export default router;
