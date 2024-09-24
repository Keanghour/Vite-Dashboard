<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const customers1 = ref([]);
const loading1 = ref(true);
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const defaultImage = 'https://www.pngkit.com/png/full/329-3292528_fire-magic-cover-for-refreshment-center.png';

const currentCustomer = reactive({
    id: null,
    name: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    profilePicture: defaultImage,
});
const customerDialogVisible = ref(false);
const viewDialogVisible = ref(false);
const isEditMode = ref(false);

onBeforeMount(async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/users');
        const data = await response.json();
        customers1.value = data.slice(0, 20).map(user => ({
            id: user.id,
            name: `${user.name.firstname} ${user.name.lastname}`,
            gender: user.gender || 'Not specified',
            phone: user.phone || 'Not provided',
            email: user.email,
            address: `${user.address.city}, ${user.address.street}, ${user.address.number}`,
            profilePicture: user.image || defaultImage,
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        loading1.value = false;
    }
});

const showAddCustomerDialog = () => {
    resetCurrentCustomer();
    customerDialogVisible.value = true;
    isEditMode.value = false;
};

const editCustomer = (customer) => {
    Object.assign(currentCustomer, customer);
    customerDialogVisible.value = true;
    isEditMode.value = true;
};

const viewCustomer = (customer) => {
    Object.assign(currentCustomer, customer);
    viewDialogVisible.value = true;
};

const saveCustomer = () => {
    if (isEditMode.value) {
        const index = customers1.value.findIndex(c => c.id === currentCustomer.id);
        if (index !== -1) {
            customers1.value[index] = { ...currentCustomer };
        }
    } else {
        const newId = customers1.value.length + 1;
        customers1.value.push({ ...currentCustomer, id: newId });
    }
    closeDialog();
};

const deleteCustomer = (customerId) => {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers1.value = customers1.value.filter(customer => customer.id !== customerId);
    }
};

const closeDialog = () => {
    customerDialogVisible.value = false;
    resetCurrentCustomer();
};

const resetCurrentCustomer = () => {
    currentCustomer.id = null;
    currentCustomer.name = '';
    currentCustomer.gender = 'Male';
    currentCustomer.phone = '';
    currentCustomer.email = '';
    currentCustomer.address = '';
    currentCustomer.profilePicture = defaultImage;
};
</script>


<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Filtering</div>
        <DataTable
            :value="customers1"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :filters="filters1"
            filterDisplay="menu"
            :loading="loading1"
            :globalFilterFields="['name', 'gender', 'email']"
            showGridlines
            stripedRows
            tableStyle="min-width: 50rem"
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" label="Add User" @click="showAddCustomerDialog" />
                    <div class="flex align-items-center">
                        <!-- <i class="pi pi-search" /> -->
                        <InputText v-model="filters1.global.value" placeholder="Keyword Search" />
                    </div>
                </div>
            </template>
            <template #empty>No customers found.</template>
            <template #loading>Loading customers data. Please wait.</template>

            <Column header="No" style="min-width: 2rem">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>

            <Column header="Profile" style="min-width: 6rem">
                <template #body="{ data }">
                    <img :src="data.profilePicture" alt="Profile" style="width: 32px; border-radius: 50%;" />
                </template>
            </Column>

            <Column field="name" header="Name" style="min-width: 12rem" />
            <Column field="gender" header="Gender" style="min-width: 4rem" />
            <Column field="phone" header="Phone" style="min-width: 12rem" />
            <Column field="email" header="Email" style="min-width: 12rem" />
            <Column field="address" header="Address" style="min-width: 16rem" />
            <Column header="Actions" style="min-width: 7rem">
                <template #body="{ data }">
                    <div class="flex justify-center space-x-4">
                        <i class="pi pi-eye cursor-pointer action-icon" @click="viewCustomer(data)" title="View Customer"></i>
                        <i class="pi pi-pencil cursor-pointer action-icon" @click="editCustomer(data)" title="Edit Customer"></i>
                        <i class="pi pi-trash cursor-pointer action-icon" @click="deleteCustomer(data.id)" title="Delete Customer"></i>
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Add/Edit Customer Dialog -->
        <Dialog :visible="customerDialogVisible" modal @hide="closeDialog" :header="isEditMode ? 'Edit Customer' : 'Add Customer'">
            <div class="form-container">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="currentCustomer.name" />
                </div>
                <div class="field">
                    <label for="gender">Gender</label>
                    <Dropdown id="gender" v-model="currentCustomer.gender" :options="['Male','Female']" placeholder="Select Gender" />
                </div>
                <div class="field">
                    <label for="phone">Phone</label>
                    <InputText id="phone" v-model="currentCustomer.phone" />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="currentCustomer.email" />
                </div>
                <div class="field">
                    <label for="address">Address</label>
                    <InputText id="address" v-model="currentCustomer.address" />
                </div>
                <div class="field">
                    <label for="profilePicture">Profile Picture URL</label>
                    <InputText id="profilePicture" v-model="currentCustomer.profilePicture" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="closeDialog" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveCustomer" />
            </template>
        </Dialog>

        <!-- View Customer Dialog -->
        <Dialog :visible="viewDialogVisible" modal @hide="viewDialogVisible = false" header="Customer Details">
            <div class="form-container">
                <div><strong>Name:</strong> {{ currentCustomer.name }}</div>
                <div><strong>Gender:</strong> {{ currentCustomer.gender }}</div>
                <div><strong>Phone:</strong> {{ currentCustomer.phone }}</div>
                <div><strong>Email:</strong> {{ currentCustomer.email }}</div>
                <div><strong>Address:</strong> {{ currentCustomer.address }}</div>
                <div><strong>Profile Picture:</strong> <img :src="currentCustomer.profilePicture" alt="Profile" style="width: 50px; border-radius: 50%;" /></div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" @click="viewDialogVisible = false" class="p-button-text" />
            </template>
        </Dialog>
    </div>
</template>


<style scoped lang="scss">
.form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.field {
    display: flex;
    flex-direction: column;
}
.cursor-pointer {
    cursor: pointer;
}
.action-icon {
    font-size: 1rem;
    transition: transform 0.2s, color 0.2s;
    color: #555;

    &:hover {
        transform: scale(1.1);
        color: #007bff;
    }
}
</style>
