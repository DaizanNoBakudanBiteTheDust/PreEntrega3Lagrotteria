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
import {
    saveCart
} from '../services/cart.service.js'
import infoDto from '../DTOs/info.dto.js';
import configs from '../config.js';

const registerUser = async (req, res) => {
    try {
        const { email, first_name, last_name, age, password } = req.body;
        const user = await getUserByEmail(email);

        if (user) {
            return res.status(400).json({ error: 'El usuario ya está registrado' });
        }

        const userToSave = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        };

        // Guardar el usuario primero para obtener el _id
        const result = await saveUser(userToSave);

        // Crear un carrito nuevo para el usuario registrado
        const cart = await saveCart({ userId: result._id });

        const cartObjectId = cart.cart._id;


        // Agrega el carrito recién creado al usuario
        await cartToUser(result._id, cartObjectId);

        res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente', user: result });
    } catch (error) {
        console.log(error);

    }
};

const failRegisterUser = async (req, res) => {
    res.status(500).send({
        status: 'error',
        message: 'register failed'
    })
};


const adminUser = {
    email: configs.adminUser,
    password: configs.adminPass
};


const loginUser = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (email === configs.adminUser || password === configs.adminPass) {
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

     // Verifica que los campos requeridos estén presentes en la petición

    const userNew = await getUserByEmail(email);


    //generar el jwt
    const {
        password: _,
        ...userResult
    } = userNew;
    const accessToken = generateToken(userResult);

    console.log(accessToken, userNew)

   


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
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { first_name, last_name, age } = req.user; // Suponiendo que los datos del usuario están en req.user

        // Verifica si existen name y lastname antes de crear la instancia de infoDto
        if (!first_name, !last_name) {
            return res.status(400).json({ error: 'Faltan datos del usuario' });
        }

        const User = new infoDto({first_name, last_name, age });
        res.status(200).json({ user: User });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario actual' });
    }
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