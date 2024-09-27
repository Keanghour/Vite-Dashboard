<template>
    <div>
        <div class="card">
            <h3 class="text-center mb-4">Product List</h3>
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Add Product" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts.length" />
                </template>
                <template #end>
                    <InputText v-model="filters.global.value" placeholder="Search..." />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedProducts" :value="products" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 25, 50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Item Name" sortable style="min-width: 16rem"></Column>
                <Column field="image" header="Image" :body="imageBodyTemplate" style="width: 10rem"></Column>
                <Column field="category" header="Category" sortable style="min-width: 10rem"></Column>
                <Column field="brand" header="Brand Name" sortable style="min-width: 10rem"></Column>
                <Column field="quantity" header="Units" sortable style="min-width: 10rem"></Column>
                <Column field="price" header="Price" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
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
        </div>

        <!-- Dialogs for product management -->
        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="dialog-content">
                <InputText v-model="product.name" placeholder="Product Name" class="mb-3" />
                <InputText v-model="product.code" placeholder="Product Code" class="mb-3" />
                <InputText v-model="product.category" placeholder="Category" class="mb-3" />
                <InputText v-model="product.brand" placeholder="Brand" class="mb-3" />
                <InputNumber v-model="product.quantity" placeholder="Units" class="mb-3" />
                <InputNumber v-model="product.price" placeholder="Price" class="mb-3" />
                <Dropdown v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select Status" class="mb-3" />
                <div class="dialog-buttons">
                    <Button label="Save" @click="saveProduct" />
                    <Button label="Cancel" @click="hideDialog" class="ml-2" />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div>
                <p>Are you sure you want to delete this product?</p>
                <div class="dialog-buttons">
                    <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
                    <Button label="No" icon="pi pi-times" @click="() => deleteProductDialog.value = false" class="ml-2" />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div>
                <p>Are you sure you want to delete the selected products?</p>
                <div class="dialog-buttons">
                    <Button label="Yes" icon="pi pi-check" @click="deleteSelectedProducts" />
                    <Button label="No" icon="pi pi-times" @click="() => deleteProductsDialog.value = false" class="ml-2" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'In Stock', value: 'instock' },
    { label: 'Out of Stock', value: 'outofstock' }
]);
const toast = useToast();

onMounted(async () => {
    try {
        const data = await ProductService.getProducts();
        products.value = data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
});

function formatCurrency(value) {
    return value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
}

function openNew() {
    product.value = {
        name: '',
        code: '',
        category: '',
        brand: '',
        quantity: 0,
        price: 0,
        inventoryStatus: 'instock',
    };
    submitted.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
}

function saveProduct() {
    submitted.value = true;

    if (product.value.name?.trim()) {
        if (product.value.id) {
            products.value[findIndexById(product.value.id)] = { ...product.value };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            products.value.push({ ...product.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        hideDialog();
    }
}

function editProduct(prod) {
    product.value = { ...prod };
    productDialog.value = true;
}

function confirmDeleteProduct(prod) {
    product.value = prod;
    deleteProductDialog.value = true;
}

function deleteProduct() {
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteProductDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

function findIndexById(id) {
    return products.value.findIndex(product => product.id === id);
}

function createId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
    products.value = products.value.filter(val => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function getStatusLabel(status) {
    return status === 'instock' ? 'success' : 'danger';
}
</script>

<style scoped>
.text-center {
    text-align: center;
}

.card {
    padding: 20px;
    margin: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.dialog-content {
    display: flex;
    flex-direction: column;
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.mb-3 {
    margin-bottom: 1rem;
}

.ml-2 {
    margin-left: 0.5rem;
}
</style>
