const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


//INICIALIZACION
const app = express();
require('./lib/passport');

//CONFIGURACIONES
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    //defaultLayout: 'main',
    //layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//MIDDLEWARES
app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        aameSite: true,
        secure: false // ENABLE ONLY ON HTTPS 
    },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//VARIABLES GLOBALES
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//RUTAS
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/inmuebles'));

//PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

//INICIAR SERVIDOR
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
});