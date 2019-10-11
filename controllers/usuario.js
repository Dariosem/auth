const passport = require('passport');
const Usuario = require('../models/usuario');

exports.postSignUp = (req, res, next) => {
    const nuevoUsuario = new Usuario({
        email: req.body.email,
        nombre: req.body.nombre,
        password: req.body.password
    });
    
    Usuario.findOne({email:req.body.email}, (err, usuarioExistente) => {
        if (usuarioExistente) {
            return res.status(400).send('El email ya se encuentra registrado');
        }
        nuevoUsuario.save((err) => {
            if (err) {
                next(err);
            } else {
                req.logIn(nuevoUsuario, (err) => {
                    if (err) {
                        next(err);
                    } 
                    res.status(200).send('Usuario creado correctamente');
                })
            }
            
        })
    })

}

exports.postLogIn = (req, res, next) => {
    passport.authenticate('local', (err, usuario, info) => {
        if(err){
            next(err);
        }
        if (!usuario) {
            return res.status(400).send('Email o contraseña no valida');
        }
        req.logIn(usuario, (err) => {
            if (err) {
                next(err);
            }
            res.status(200).send('Login exitoso');
        })
    })(req, res, next);
}

exports.logOut = (req, res) => {
    req.logout();
    res.status(200).send('Logout exitoso');
}