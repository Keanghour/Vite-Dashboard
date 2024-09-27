<template>
    <div>
        <div class="card">
            <h3 class="text-center mb-4">Stock List</h3>
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Add Stock" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedStocks.length" />
                </template>
                <template #end>
                    <InputText v-model="filters.global.value" placeholder="Search..." />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedStocks" :value="stocks" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 25, 50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} stocks">
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="purchaseId" header="Purchase ID" sortable style="min-width: 12rem"></Column>
                <Column field="itemName" header="Item Name" sortable style="min-width: 16rem"></Column>
                <Column field="image" header="Image" :body="imageBodyTemplate" style="width: 10rem"></Column>
                <Column field="dateComing" header="Date Coming" sortable style="min-width: 10rem"></Column>
                <Column field="expiryDate" header="Expiry Date" sortable style="min-width: 10rem"></Column>
                <Column field="purchasePrice" header="Purchase Price" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.purchasePrice) }}
                    </template>
                </Column>
                <Column field="sellingPrice" header="Selling Price" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.sellingPrice) }}
                    </template>
                </Column>
                <Column field="quantity" header="Quantity" sortable style="min-width: 10rem"></Column>
                <Column field="stockIn" header="Stock In" sortable style="min-width: 10rem"></Column>
                <Column field="stockOut" header="Stock Out" sortable style="min-width: 10rem"></Column>
                <Column field="paymentMode" header="Payment Mode" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editStock(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteStock(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Dialogs for stock management -->
        <Dialog v-model:visible="stockDialog" :style="{ width: '450px' }" header="Stock Details" :modal="true">
            <div class="dialog-content">
                <InputText v-model="stock.itemName" placeholder="Item Name" class="mb-3" />
                <InputText v-model="stock.purchaseId" placeholder="Purchase ID" class="mb-3" />
                <InputText v-model="stock.dateComing" placeholder="Date Coming" class="mb-3" />
                <InputText v-model="stock.expiryDate" placeholder="Expiry Date" class="mb-3" />
                <InputNumber v-model="stock.purchasePrice" placeholder="Purchase Price" class="mb-3" />
                <InputNumber v-model="stock.sellingPrice" placeholder="Selling Price" class="mb-3" />
                <InputNumber v-model="stock.quantity" placeholder="Quantity" class="mb-3" />
                <InputNumber v-model="stock.stockIn" placeholder="Stock In" class="mb-3" />
                <InputNumber v-model="stock.stockOut" placeholder="Stock Out" class="mb-3" />
                <Dropdown v-model="stock.paymentMode" :options="paymentModes" optionLabel="label" placeholder="Select Payment Mode" class="mb-3" />
                <div class="dialog-buttons">
                    <Button label="Save" @click="saveStock" />
                    <Button label="Cancel" @click="hideDialog" class="ml-2" />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="deleteStockDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div>
                <p>Are you sure you want to delete this stock?</p>
                <div class="dialog-buttons">
                    <Button label="Yes" icon="pi pi-check" @click="deleteStock" />
                    <Button label="No" icon="pi pi-times" @click="() => deleteStockDialog.value = false" class="ml-2" />
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="deleteStocksDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div>
                <p>Are you sure you want to delete the selected stocks?</p>
                <div class="dialog-buttons">
                    <Button label="Yes" icon="pi pi-check" @click="deleteSelectedStocks" />
                    <Button label="No" icon="pi pi-times" @click="() => deleteStocksDialog.value = false" class="ml-2" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { ProductService } from '@/service/ProductService'; // Adjust this import if needed

const stocks = ref([
    {
        id: "1",
        purchaseId: "PUR12345",
        itemName: "Widget A",
        image: "https://via.placeholder.com/100",
        dateComing: "2024-01-15",
        expiryDate: "2025-01-15",
        purchasePrice: 10.00,
        sellingPrice: 15.00,
        quantity: 100,
        stockIn: 50,
        stockOut: 20,
        paymentMode: "cash"
    },
    {
        id: "2",
        purchaseId: "PUR12346",
        itemName: "Widget B",
        image: "https://via.placeholder.com/100",
        dateComing: "2024-02-10",
        expiryDate: "2025-02-10",
        purchasePrice: 12.00,
        sellingPrice: 18.00,
        quantity: 200,
        stockIn: 100,
        stockOut: 30,
        paymentMode: "credit_card"
    },
    {
        id: "3",
        purchaseId: "PUR12347",
        itemName: "Widget C",
        image: "https://via.placeholder.com/100",
        dateComing: "2024-03-05",
        expiryDate: "2025-03-05",
        purchasePrice: 8.00,
        sellingPrice: 12.00,
        quantity: 150,
        stockIn: 75,
        stockOut: 25,
        paymentMode: "bank_transfer"
    },
    {
        id: "4",
        purchaseId: "PUR12348",
        itemName: "Widget D",
        image: "https://via.placeholder.com/100",
        dateComing: "2024-04-20",
        expiryDate: "2025-04-20",
        purchasePrice: 5.00,
        sellingPrice: 9.00,
        quantity: 300,
        stockIn: 150,
        stockOut: 40,
        paymentMode: "cash"
    },
    {
        id: "5",
        purchaseId: "PUR12349",
        itemName: "Widget E",
        image: "https://via.placeholder.com/100",
        dateComing: "2024-05-15",
        expiryDate: "2025-05-15",
        purchasePrice: 20.00,
        sellingPrice: 30.00,
        quantity: 50,
        stockIn: 25,
        stockOut: 10,
        paymentMode: "credit_card"
    }
]);

const stockDialog = ref(false);
const deleteStockDialog = ref(false);
const deleteStocksDialog = ref(false);
const stock = ref({});
const selectedStocks = ref([]);
const filters = ref({
    global: { value: null }
});
const paymentModes = ref([
    { label: 'Cash', value: 'cash' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Bank Transfer', value: 'bank_transfer' }
]);
const toast = useToast();

function formatCurrency(value) {
    return value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
}

function openNew() {
    stock.value = {
        itemName: '',
        purchaseId: '',
        dateComing: '',
        expiryDate: '',
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: 0,
        stockIn: 0,
        stockOut: 0,
        paymentMode: paymentModes.value[0].value
    };
    stockDialog.value = true;
}

function hideDialog() {
    stockDialog.value = false;
}

function saveStock() {
    if (stock.value.itemName?.trim()) {
        if (stock.value.id) {
            stocks.value[findIndexById(stock.value.id)] = { ...stock.value };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Stock Updated', life: 3000 });
        } else {
            stock.value.id = createId();
            stocks.value.push({ ...stock.value });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Stock Created', life: 3000 });
        }
        hideDialog();
    }
}

function editStock(stockData) {
    stock.value = { ...stockData };
    stockDialog.value = true;
}

function confirmDeleteStock(stockData) {
    stock.value = stockData;
    deleteStockDialog.value = true;
}

function deleteStock() {
    stocks.value = stocks.value.filter(val => val.id !== stock.value.id);
    deleteStockDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Stock Deleted', life: 3000 });
}

function findIndexById(id) {
    return stocks.value.findIndex(stock => stock.id === id);
}

function createId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function confirmDeleteSelected() {
    deleteStocksDialog.value = true;
}

function deleteSelectedStocks() {
    stocks.value = stocks.value.filter(val => !selectedStocks.value.includes(val));
    deleteStocksDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Stocks Deleted', life: 3000 });
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
