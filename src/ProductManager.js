// src/ProductManager.js
import fs from 'fs/promises'; 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    // Establecer la ruta al archivo de productos
    setPath(filePath) {
        this.path = path.resolve(__dirname, filePath);
    }

    // Obtener todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, devolver un array vacío
            return [];
        }
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    // Agregar un nuevo producto
    async addProduct(product) {
        const products = await this.getProducts();
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        product.id = newId;
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    // Actualizar un producto por su ID
    async updateProduct(id, updateData) {
        let products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            // Actualizar solo los campos proporcionados en updateData
            products[productIndex] = { ...products[productIndex], ...updateData };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[productIndex];
        } else {
            return null; // Producto no encontrado
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(id) {
        let products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            products.splice(productIndex, 1); // Eliminar producto
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return true; // Producto eliminado correctamente
        } else {
            return false; // Producto no encontrado
        }
    }
}

export default ProductManager;

