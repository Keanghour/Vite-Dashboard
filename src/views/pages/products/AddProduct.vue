<template>
    <div class="add-product-container">
        <h3 class="text-center mb-4">Add New Product</h3>
        <form @submit.prevent="saveProduct">
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <label for="name" class="block font-bold mb-2">Product Name</label>
                    <InputText id="name" v-model="product.name" required />
                </div>
                <div>
                    <label for="category" class="block font-bold mb-2">Category</label>
                    <InputText id="category" v-model="product.category" required />
                </div>
                <div>
                    <label for="price" class="block font-bold mb-2">Price</label>
                    <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" required />
                </div>
                <div>
                    <label for="brand" class="block font-bold mb-2">Brand Name</label>
                    <InputText id="brand" v-model="product.brand" required />
                </div>
                <div>
                    <label for="quantity" class="block font-bold mb-2">Quantity</label>
                    <InputNumber id="quantity" v-model="product.quantity" integeronly required />
                </div>
                <div>
                    <label for="inventoryStatus" class="block font-bold mb-2">Status</label>
                    <Select id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" />
                </div>
            </div>
            <div class="flex justify-end mt-4">
                <Button label="Cancel" icon="pi pi-times" class="mr-2" @click="cancel" />
                <Button label="Add Product" icon="pi pi-check" type="submit" />
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Select from 'primevue/selectbutton'; // Correct import for Select

const product = ref({
    name: '',
    category: '',
    price: null,
    brand: '',
    quantity: null,
    inventoryStatus: null
});

const statuses = ref([
    { label: 'In Stock', value: 'instock' },
    { label: 'Out of Stock', value: 'outofstock' }
]);

function saveProduct() {
    // Logic to save the product goes here
    console.log('Product saved:', product.value);
}

function cancel() {
    // Logic to handle cancellation
    console.log('Action cancelled');
}
</script>

<style scoped>
.add-product-container {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.text-center {
    text-align: center;
}
</style>
