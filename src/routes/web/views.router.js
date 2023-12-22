import {
    Router
} from 'express'
import Products from '../../dao/dbManagers/products.manager.js';
import Carts from '../../dao/dbManagers/cart.manager.js';
import Messages from '../../dao/dbManagers/message.manager.js';
import usersModel from '../../dao/dbManagers/models/users.models.js';
import passport from 'passport';
import {passportStrategiesEnum, accessRolesEnum} from '../../config/enums.js';
import {
    productsModel
} from "../../dao/dbManagers/models/products.models.js";

const router = Router();

const prodManager = new Products();
const cartManager = new Carts();
const chatManager = new Messages();


const passportJWT = passport.authenticate('jwt', {
    session: false
});

const GithubStr = passport.authenticate('github', { session: false});

const publicAccess = (req, res, next) => {
    if(req.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    passportJWT(req, res, (err) => {
        if (err || !req.user) {
            return res.redirect('/login');
        }
        next();
    });
}

router.get('/productsLog', async (req, res) => {

    res.render('home', {
        products: await prodManager.getAll(req)
    });

});



router.get('/register', publicAccess, (req, res) => {
    res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login')
});


router.get('/', privateAccess, async (req, res) => {
    try {
        // El usuario está autenticado mediante JWT, puedes acceder a la información del usuario en req.user
        const user = req.user;

        let userData = user;

        if (user && user._doc) {
            // Utiliza _doc si está presente (por ejemplo, en la estrategia JWT)
            userData = user._doc;
        }

        console.log(userData)
        // Obtener todos los productos
        const allProducts = await prodManager.getAll(req);

        res.render('home', {
            user: userData,
            cartId: userData.carts[0].cart._id,
            products: allProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});




router.get('/realTimeProducts', async (req, res) => {
    res.render('realTimeProducts', {
        products: await prodManager.getAll(req)
    });
});

router.get('/products', async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;
    const queryValue = req.query.queryValue || null;

    // Configurar las opciones de búsqueda
    const options = {
        limit,
        page,
        lean: true
    };

    if (sort !== null) {
        options.sort = sort; // Aplica el valor de sort solo si no es null
    }

    const filter = {};

    if (query !== null && queryValue !== null) {
        filter[query] = queryValue; // Aplica el valor de sort solo si no es null
    }

    // Se agrega lógica para determinar el orden
    if (sort !== null) {
        if (sort.toLowerCase() === 'asc') {

            options.sort = {
                precio: 'asc'
            };
        } else if (sort.toLowerCase() === 'desc') {
            options.sort = {
                precio: 'desc'
            };
        }
    }

    // se agregan parametros de paginacion

    const {
        docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    } = await productsModel.paginate(filter, options);

    res.render('products', {
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit: limit,
        page,
        query,
        sort
    });

});

router.get('/realTimeCarts', async (req, res) => {
    res.render('realTimeCarts', {
        carts: await cartManager.getAll()
    });
});

router.get('/cart', async (req, res) => {
    const cartById = '6548f637d8891916f4b7065b';
    const cartData = await cartManager.getCartById({
        _id: cartById
    });

    const transformedData = cartData.products.map(product => ({
        product: product.product, // Ajusta según tu estructura real
        quantity: product.quantity,
        _id: product._id
    }));


    // Comprueba si el carrito se encontró
    if (!cartData) {
        return res.status(404).send('Carrito no encontrado');
    }

    const products = transformedData;

    console.log(products);

    res.render('cartId', {
        cartProducts: products
    });
});

router.get('/chat', async (req, res) => {
    res.render('chat', {
        chat: await chatManager.getAll()
    });
});


export default router;