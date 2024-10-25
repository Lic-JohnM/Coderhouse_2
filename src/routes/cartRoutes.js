import { Router } from 'express';
import CartManager from '../CartManager.js'; 

const router = Router();
const cartManager = new CartManager(); // Crear una instancia de CartManager

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = cartManager.loadCarts(); // Cambia a un método sincrónico
        res.json(carts); // Debería devolver un array
    } catch (error) {
        console.error("Error en /api/carts:", error);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

// Agregar un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = cartManager.addCart(); // Agregar un nuevo carrito
        return res.status(201).json(newCart);
    } catch (error) {
        console.error("Error en /api/carts:", error);
        return res.status(500).json({ error: 'Error al agregar el carrito' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const quantity = req.body.quantity || 1; 

    try {
        const updatedCart = cartManager.addProductToCart(cartId, productId, quantity); // Agregar producto al carrito
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error en /api/carts/:cid/products/:pid:", error);
        return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default router;
