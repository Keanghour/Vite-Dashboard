<template>
    <div class="stock-container">
        <h3 class="text-center mb-4">Stock Management</h3>
        <Toolbar class="mb-4">
            <template #start>
                <Button label="Add Stock" icon="pi pi-plus" severity="secondary" @click="openNew" />
            </template>
            <template #end>
                <InputText v-model="filters.global" placeholder="Search..." />
            </template>
        </Toolbar>

        <DataTable
            ref="dt"
            v-model:selection="selectedProducts"
            :value="products"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column header="#" style="width: 3rem">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <Column field="image" header="Image" style="width: 10rem">
                <template #body="slotProps">
                    <img :src="slotProps.data.image" alt="Product Image" class="rounded" style="width: 64px" />
                </template>
            </Column>
            <Column field="name" header="Product Name" sortable style="min-width: 16rem" />
            <Column field="expiryDate" header="Expiry Date" sortable style="min-width: 10rem" />
            <Column field="stockOnHand" header="Stock on Hand" sortable style="min-width: 10rem" />
            <Column field="value" header="Value" sortable style="min-width: 10rem">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.value) }}
                </template>
            </Column>
            <Column field="inventoryStatus" header="Status" sortable style="min-width: 10rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- Dialogs for managing stock -->
        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <!-- Product dialog content goes here -->
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <!-- Confirm delete dialog content -->
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { ProductService } from '@/service/ProductService';

const products = ref([]);
const selectedProducts = ref([]);
const filters = ref({ global: null }); // Ensure filters are initialized
const toast = useToast();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});

onMounted(() => {
    ProductService.getProducts().then(data => {
        products.value = data;
    }).catch(error => {
        console.error("Failed to fetch products:", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not fetch products', life: 3000 });
    });
});

function formatCurrency(value) {
    return value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
}

function getStatusLabel(status) {
    return status === 'instock' ? 'success' : 'danger';
}

function openNew() {
    // Logic to open dialog for adding new product
}

function editProduct(prod) {
    // Logic to edit product
}

function confirmDeleteProduct(prod) {
    // Logic to confirm delete
}

// Add more functions as necessary...
</script>

<style scoped>
.stock-container {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.text-center {
    text-align: center;
}
</style>
