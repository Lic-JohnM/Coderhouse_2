// src/routes/productRoutes.js
import { Router } from 'express';
import ProductManager from '../ProductManager.js'; 
import { procesaErrores } from '../utils.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json'); // Crea una instancia de ProductManager

// Definir rutas

// Para la vista con Handlebars

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(); // Obtener todos los productos
        res.render('index', { products }); // Renderizar la vista 'index' con los productos
    } catch (error) {
        procesaErrores(res, error);
    }
});

// Para devolver la lista como JSON
router.get('/json', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(products); // Devuelve los productos en formato JSON
    } catch (error) {
        procesaErrores(res, error);
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const productId = Number(id);

    if (isNaN(productId)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `ID debe ser numérico` });
    }

    try {
        const product = await productManager.getProductById(productId); // Obtener producto por ID
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `No existe un producto con ID ${id}` });
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(product); // Devuelve el producto encontrado
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.post('/', async (req, res) => {
    const { title, description, price, code, stock, category, thumbnails } = req.body;

    if (!title || !description || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Faltan datos requeridos o son inválidos.' });
    }

    try {
        const newProduct = await productManager.addProduct({ title, description, price, code, stock, category, thumbnails }); // Agregar nuevo producto
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json(newProduct); // Devuelve el nuevo producto
    } catch (error) {
        procesaErrores(res, error);
    }
});


router.put('/:pid', async (req, res) => {
    const productId = Number(req.params.pid); // Obtener ID del producto desde la URL
    const updateData = req.body; // Datos actualizados desde el cuerpo de la solicitud

    try {
        const updatedProduct = await productManager.updateProduct(productId, updateData);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.status(200).json(updatedProduct); // Enviar el producto actualizado
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por su ID (DELETE)
router.delete('/:pid', async (req, res) => {
    const productId = Number(req.params.pid); // Obtener ID del producto desde la URL

    try {
        const productDeleted = await productManager.deleteProduct(productId);
        if (!productDeleted) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router; // Exportar el router
