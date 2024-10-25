// src/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';

import fs from 'fs';
import { engine } from 'express-handlebars'; // Importa express-handlebars

import http from 'http'; // Importar http
import { Server } from 'socket.io'; // Importar Server de socket.io
import exphbs from 'express-handlebars';

import ProductManager from './ProductManager.js'; // Asegúrate de importar ProductManager

import productRoutes from './routes/productRoutes.js'; 
import cartRoutes from './routes/cartRoutes.js'; 

const app = express();
const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server); // Inicializar Socket.IO
const PORT = 8080; 

const productManager = new ProductManager('./src/data/products.json'); // Crear instancia de ProductManager



// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src', 'views')); // Define la ubicación de las vistas

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public'))); // Servir archivos estáticos desde la carpeta 'public'

// Rutas de productos
app.use('/api/products', productRoutes); // Usar las rutas de productos
app.use('/api/carts', cartRoutes); // Rutas para manejar carritos
app.use('/products', productRoutes); // rutas para usar el handlebars con /products


// Ruta para mostrar los productos en el carrito usando Handlebars
app.get('/cart', (req, res) => {
    // Supongamos que tienes una función getCartProducts para obtener los productos del carrito
    const cart = getCartProducts();  // Cambia esto según la lógica que manejes
    res.render('cart', { cart });    // Renderiza la vista 'cart' con los productos del carrito
});

// Configurar la ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts'); // Renderizar la vista realTimeProducts.handlebars
});
// Función para obtener los productos desde un archivo JSON
function getProducts() {
    const filePath = path.join(process.cwd(), 'src', 'data', 'products.json'); // Asegúrate de que la ruta sea correcta
    const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return products; // Devuelve la lista de productos
}

/// En la conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Obtén los productos y emítelos al cliente conectado
    const products = getProducts(); // Llama a la función que definiste
    socket.emit('initialProducts', products); // Envía la lista de productos

    // Resto del código para manejar nuevos productos y eliminaciones
    socket.on('newProduct', (product) => {
        io.emit('updateProducts', product);
    });

    socket.on('deleteProduct', (productId) => {
        io.emit('productDeleted', productId);
    });
});




function getCartProducts() {
    const filePath = path.join(process.cwd(), 'src', 'data', 'carts.json');
    const carts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Supongamos que el carrito que quieres mostrar es el primero (ajusta según tu lógica)
    return carts[0].products; // Obtén los productos del carrito
}


// Ruta raíz opcional (puedes definirla según lo necesites)
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html')); // Sirve index.html directamente
});

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
