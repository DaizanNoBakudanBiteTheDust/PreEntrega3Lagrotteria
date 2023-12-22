import {
        Router
} from 'express';
import {
        deleteProducts,
        getProducts,
        postProducts,
        updateProductById
} from '../../controlers/products.controller.js';

// const manager = new ProductManager(productsFilePath);

const router = Router();

//read

router.get('/', getProducts);


// postea los productos

router.post('/', postProducts);

// Actualiza los productos

router.put('/:pid', updateProductById);


// Elimina los productos

router.delete('/:pid', deleteProducts)


export default router;