import {
    Router
} from 'express';
import passport from 'passport';
import {
    registerUser,
    failRegisterUser,
    loginUser,
    userFailLogin,
    userLogout,
    getUserId,
    userGithubLogin,
    userGithubCallback,
    getCurrentUser
} from '../../controlers/users.controller.js'
import configs from '../../config.js'

const router = Router();

router.post('/register', registerUser);

router.get('/fail-register', failRegisterUser);


const adminUser = {
    email: configs.adminUser,
    password: configs.adminPass
};

router.post('/login', loginUser);


router.get('/fail-login', userFailLogin);

router.get('/logout', userLogout);


router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}), userGithubLogin);

router.get('/github-callback', passport.authenticate('github', {
    failureRedirect: '/login',
    scope: ['user:email']
}), userGithubCallback);

router.get('/current', passport.authenticate('jwt', {
    session: false
}), getCurrentUser);

router.get('/:uid', getUserId);



export default router;