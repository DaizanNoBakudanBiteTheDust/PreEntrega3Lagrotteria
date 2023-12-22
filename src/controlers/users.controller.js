import {
    getUserByEmail,
    saveUser,
    cartToUser
} from '../services/users.service.js';
import {
    createHash,
    isValidPassword,
    generateToken
} from '../utils.js';
import Users from '../dao/dbManagers/users.manager.js';
import Carts from '../dao/dbManagers/cart.manager.js';

const manager = new Users();
const cartManager = new Carts();

const registerUser = async (req, res) => {
    res.status(201).send({
        status: 'success',
        message: 'user registered'
    });
};

const failRegisterUser = async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'register failed'
    })
};


const adminUser = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123'
};


const loginUser = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
        req.user = {
            name: 'Admin', // O cualquier otro nombre para el administrador
            email: email,
            role: 'admin'
        };

        return res.send({
            status: 'success',
            message: 'Inicio de sesión como administrador exitoso'
        });
    }

    const user = await getUserByEmail(email);
    console.log(user);

    if (!user.carts || user.carts.length === 0) {
        // Si el usuario no tiene un carrito, crea uno nuevo
        let cart = await saveUser({
            userId: user._id
        });

        let userCart = cart._id;
        console.log(userCart)
        // Agrega el carrito recién creado al usuario

        await cartToUser(user._id, userCart);
    }

    //generar el jwt
    const {
        password: _,
        ...userResult
    } = user;
    const accessToken = generateToken(userResult);
    res.cookie('coderCookieToken', accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }).send({
        accessToken,
        status: 'success',
        message: 'login success'
    })
};


const userFailLogin = async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'login failed'
    })
};

const userLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        res.clearCookie('connect.sid');
        res.clearCookie('coderCookieToken');
        res.redirect('/login'); // Redirige a donde quieras después del logout
    });
};


const getUserId = async (req, res) => {
    console.log(req.params);
    res.send(req.params);
};

const userGithubLogin = async (req, res) => {
    res.send({
        status: 'success',
        message: 'user registered'
    });
};


const userGithubCallback = async (req, res) => {
    try {
        const user = req.user;
        const {
            password: _,
            ...userResult
        } = user;
        const accessToken = generateToken(userResult);
        res.cookie('coderCookieToken', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).send({
            accessToken,
            status: 'success',
            message: 'login success'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Hubo un error al procesar la autenticación'
        });
    }

};

const getCurrentUser = (req, res) => {
    // Si el middleware de autenticación JWT pasa, req.user contendrá la información del usuario extraída del token
    res.status(200).json({
        user: req.user
    });
};


export {
    registerUser,
    failRegisterUser,
    loginUser,
    userFailLogin,
    userLogout,
    getUserId,
    userGithubLogin,
    userGithubCallback,
    getCurrentUser
}