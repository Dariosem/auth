const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const usuarioController = require('./controllers/usuario');
const passportConfig = require('./config/passport');


const mongo_url = 'mongodb://localhost:27017/auth';
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(mongo_url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
mongoose.connection.on('error', (err)=>{
    throw err;
    process.exit(1);
})

app.use(session({
    secret: 'codigo secreto',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        url: mongo_url,
        autoReconnect: true
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* app.get('/', (req,res) =>{
    req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
    res.send(`Hola!. Entraste a la pagina ${req.session.cuenta} veces`);
}); */
app.post('/signup', usuarioController.postSignUp);
app.post('/login', usuarioController.postLogIn);
app.get('/logout', passportConfig.estaAutenticado, usuarioController.logOut);
app.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) =>{
    res.status(200).send(req.user);
});

app.listen(3000, ()=>{
    console.log('Server on port 3000');
});