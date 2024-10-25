// src/CartManager.js
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

class CartManager {
    constructor() {
        this.carts = [];
        this.path = path.resolve(__dirname, './data/carts.json'); 
        this.loadCarts();
    }

    loadCarts() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } else {
            console.log(`No se encontró el archivo en la ruta: ${this.path}`);
            this.carts = []; // Asegurarse de inicializar los carritos como un array vacío
        }
        return this.carts; // Retorna los carritos para ser usados en las rutas
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    addCart() {
        const newCart = { id: this.carts.length + 1, products: [] }; // Crear un nuevo carrito
        this.carts.push(newCart);
        this.saveCarts(); // Guardar cambios
        return newCart;
    }

    addProductToCart(cid, pid, quantity) {
        let cart = this.getCartById(cid);
        
        // Si no existe el carrito, crearlo
        if (!cart) {
            cart = { id: cid, products: [] };
            this.carts.push(cart);
        }
        
        const productIndex = cart.products.findIndex(item => item.id === pid);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity; // Aumentar la cantidad
        } else {
            cart.products.push({ id: pid, quantity }); // Agregar nuevo producto
        }
        
        this.saveCarts(); // Guardar cambios
        return cart;
    }

    saveCarts() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    }
}

export default CartManager; // Exportar la clase
