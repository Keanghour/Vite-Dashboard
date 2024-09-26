<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/components/composables/layout';
import { useRouter } from 'vue-router';  // Add this import

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const isProfileMenuVisible = ref(false);

const router = useRouter();

// Profile menu items
const profileMenuItems = [
    { label: 'Settings', icon: 'pi pi-cog' },
    { label: 'Logout', icon: 'pi pi-sign-out' }
];

function toggleProfileMenu() {
    isProfileMenuVisible.value = !isProfileMenuVisible.value;
}

function handleMenuClick(item) {
    console.log(`Clicked on ${item.label}`);
    if (item.label === 'Logout') {

        router.push({ name: 'login' });
    }
    isProfileMenuVisible.value = false;
}

function handleScroll() {
    isProfileMenuVisible.value = false;
}

onMounted(() => {
    document.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    document.removeEventListener('scroll', handleScroll);
});
</script>


<template>
    <div :class="{ 'dark-theme': isDarkTheme }" class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <span>Dashboard</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <button class="layout-topbar-action" @click="toggleProfileMenu">
                <i class="pi pi-user"></i>
            </button>
            <div :class="['profile-menu', { 'block': isProfileMenuVisible }]">
                <ul>
                    <li v-for="item in profileMenuItems" :key="item.label" @click="handleMenuClick(item)">
                        <i :class="item.icon"></i> {{ item.label }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}

.profile-menu {
    position: absolute;
    right: 1rem;
    top: 90%;
    background: white; /* Default background for light mode */
    border: 1px solid var(--border-color);
    border-radius: 0.50rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 200px;
    display: none; /* Ensure it’s hidden by default */
}

.profile-menu.block {
    display: block; /* Make sure the block class is applied */
}

/* Dark Mode Styles for Dropdown */
.dark-theme .profile-menu {
    background: black !important; /* Background for dark mode */
    border-color: #666 !important; /* Darker border for dark mode */
}

.dark-theme .profile-menu li {
    color: white !important; /* Light text color in dark mode */
}

.dark-theme .profile-menu li:hover {
    background-color: #555 !important; /* Darker hover effect in dark mode */
}

/* Profile menu item styling */
.profile-menu ul {
    list-style: none;
    padding: 6px;
    margin: 0;
}

.profile-menu li {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.profile-menu li:hover {
    background-color: var(--hover-bg-color);
}

.profile-menu i {
    margin-right: 1rem;
}
</style>
