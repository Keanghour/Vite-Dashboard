<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';


const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
    icon: 'pi pi-fw pi-briefcase',
    to: '/products',
    items: [
        {
            label: 'Products',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'List Product',
                    icon: 'pi pi-fw pi-box',
                    to: '/products/listproduct'
                },
                {
                    label: 'Add Product',
                    icon: 'pi pi-fw pi-cart-plus',
                    to: '/products/addproduct'
                },
                {
                    label: 'Stock',
                    icon: 'pi pi-fw pi-table',
                    to: '/products/stock'
                }
            ]
        }
    ]
},
    {
        items: [{ label: 'User', icon: 'pi pi-fw pi-user', to: '/user' }]
    },
    {
        items: [{ label: 'Product', icon: 'pi pi-fw pi-th-large', to: '/product' }]
    },
    {
        items: [{ label: 'Order', icon: 'pi pi-fw pi-truck', to: '/order' }]
    },
    {
        items: [{ label: 'Report', icon: 'pi pi-fw pi-book', to: '/report' }]
    },
    {
        items: [{ label: 'My Wallet', icon: 'pi pi-fw pi-wallet', to: '/wallet' }]
    },
    {
        items: [{ label: 'Notification', icon: 'pi pi-fw pi-bell', to: '/notification' }]
    },
    {
        items: [{ label: 'Setting', icon: 'pi pi-fw pi-cog', to: '/setting' }]
    },


]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
