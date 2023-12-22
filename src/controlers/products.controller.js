import {getAllProducts,
    saveProduct,
    deleteProduct,
    idProduct} from '../services/products.service.js';
import { productsModel } from '../dao/dbManagers/models/products.models.js';


const getProducts = async (req, res) => {
    const products = getAllProducts();
    res.send({
            products
    })
}

const postProducts = async (req, res) => {

    const io = req.app.get('socketio');
    const product = req.body;

    if (!product.titulo || !product.descripcion || !product.precio || !product.status || !product.thumbnail || !product.code || !product.stock || !product.category) {
            //Error del cliente
            return res.status(400).send({
                    status: 'error',
                    error: 'incomplete values'
            })
    }

    try {

            const createdProduct = saveProduct({
                    titulo: product.titulo,
                    descripcion: product.descripcion,
                    precio: product.precio,
                    status: product.status,
                    thumbnail: product.thumbnail,
                    code: product.code,
                    stock: product.stock,
                    category: product.category
            });

            io.emit('showProducts', createdProduct);

            return res.send({
                    status: 'success',
                    message: 'product created',
                    product
            })

    } catch (error) {
            return res.status(500).send({
                    status: 'error',
                    error: error.message || 'Error al crear el producto'
            });
    }
}

const updateProductById = async (req, res) => {

    const {
            pid
    } = req.params;

    const updateProduct = req.body;


    if (!updateProduct.titulo || !updateProduct.descripcion || !updateProduct.precio || !updateProduct.thumbnail || !updateProduct.code || !updateProduct.stock || !updateProduct.status || !updateProduct.category) {
            //Error del cliente
            return res.status(400).send({
                    status: 'error',
                    error: 'incomplete values'
            })
    }


    const result = await productsModel.updateOne({
            _id: pid
    }, updateProduct);

    res.send({
            status: 'success',
            message: 'product updated',
            result
    });

}

const deleteProducts = async (req, res) => {

    const io = req.app.get('socketio');
    const {
            pid
    } = req.params;

    try {
            const result = await productsModel.deleteOne({
                    _id: pid
            });
            res.send({
                    status: 'success',
                    message: 'product deleted',
                    result
            });
    } catch (error) {
            return res.status(404).send({
                    status: 'error',
                    error: 'product not exist'
            })
    }
}

export{
    getProducts,
    postProducts,
    updateProductById,
    deleteProducts
}