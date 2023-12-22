import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import local from 'passport-local';
import usersModel from '../dao/dbManagers/models/users.models.js';
import { createHash, isValidPassword } from '../utils.js';
import {passportStrategiesEnum, accessRolesEnum} from '../config/enums.js';
import configs from '../config.js';


// estrategia JWT

const localStrategy = local.Strategy;
const JWTSrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    //registro
      //registro
      passport.use('register', new localStrategy({
        passReqToCallback: true, //permite acceder al objeto request como cualquier otro middleware
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const user = await usersModel.findOne({ email: username });
            
            if(user) {
                return done(null, false);
            }

            const userToSave = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            }

            const result = await usersModel.create(userToSave);
            return done(null, result); //req.user {first,last,age,email}
        } catch (error) {
            return done(`Incorrect credentialss`)
        }
    }));


    passport.use('github', new GitHubStrategy({
        clientID:  'Iv1.da29b1c177ee2618',
        clientSecret: '0f8c0a891165fcb2a006b0ea1c5f443478e15fba',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope:['user:email']
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
           
            const email = profile.emails[0].value;
            const user = await usersModel.findOne({ email });

            if(!user){
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email,
                    password: ''
                }

                const result = await usersModel.create(newUser);
            return done(null, result);
            }else{
                return done(null, user)
            }         
        } catch (error) {
            
            console.log(error)

        }
    }));
    

    //serializacion

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async(id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
        
    })

    const cookieExtractor = req => {
        let token = null;
        if(req && req.cookies) {
            token = req.cookies['coderCookieToken'];
        }
        return token;
    }

    passport.use(passportStrategiesEnum.JWT, new JWTSrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: configs.privateJwt
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)//req.user
        } catch (error) {
            return done(error);
        }
    }))
}


export {initializePassport};