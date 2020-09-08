const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');
const admin = require('../database');
const db = admin.database();

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    db.ref('users').orderByChild('email').equalTo(email).once("value", function(snapshot) {
        const rs = snapshot.exists();
        if (!rs) {
            return done(null, false, req.flash('message', 'El usuario no está Registrado'));
        } else {
            db.ref('users').orderByChild('email').equalTo(email).once("child_added", async function(snapshot) {
                const user = snapshot.val();
                const validatePassword = await helpers.matchPassword(password, user.password);
                const id = snapshot.key;
                if (!validatePassword) {
                    return done(null, false, req.flash('message', 'Clave incorrecta'));
                } else {
                    console.log(id);
                    return done(null, user);
                }
            });
        }
    });
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { ciudad } = req.body;
    const { telefono } = req.body;
    const { passwordc } = req.body;
    const type = 'Propietario';
    if (password == passwordc) {
        const clave = await helpers.encryptPassword(password);
        let newUser = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: clave,
            ciudad: ciudad,
            telefono: telefono,
            type_user: type
        };
        const tablaref = db.ref('users');
        var rs;
        tablaref.orderByChild('email').equalTo(email).once("value", function(snapshot) {
            rs = snapshot.exists();
            if (rs) {
                return done(null, false, req.flash('message', 'El usuario ya está Registrado'));
            } else {
                db.ref('users').push(newUser);
                return done(null, null, req.flash('success', 'Usuario Registrado'));
            }
        });
    } else {
        return done(null, false, req.flash('message', 'Las Contraseñas no coinciden'));
    }
}));

passport.use('local.signupA', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { ciudad } = req.body;
    const { telefono } = req.body;
    const { passwordc } = req.body;
    const { razon } = req.body;
    const type = 'Agente';
    if (password == passwordc) {
        const clave = await helpers.encryptPassword(password);
        let newUser = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: clave,
            ciudad: ciudad,
            telefono: telefono,
            razon_social: razon,
            type_user: type
        };
        const tablaref = db.ref('users');
        var rs;
        tablaref.orderByChild('email').equalTo(email).once("value", function(snapshot) {
            rs = snapshot.exists();
            if (rs) {
                return done(null, false, req.flash('message', 'El usuario ya está Registrado'));
            } else {
                db.ref('users').push(newUser);
                return done(null, null, req.flash('success', 'Usuario Registrado'));
            }
        });
    } else {
        return done(null, false, req.flash('message', 'Las Contraseñas no coinciden'));
    }
}));

passport.use('local.signupC', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const { empresa } = req.body;
    const { contacto } = req.body;
    const { ciudad } = req.body;
    const { telefono } = req.body;
    const { passwordc } = req.body;
    const { direccion } = req.body;
    const type = 'Inmobiliaria-Constructora';
    if (password == passwordc) {
        const clave = await helpers.encryptPassword(password);
        let newUser = {
            contacto: contacto,
            direccion: direccion,
            email: email,
            password: clave,
            ciudad: ciudad,
            telefono: telefono,
            razon_social: empresa,
            type_user: type
        };
        const tablaref = db.ref('users');
        var rs;
        tablaref.orderByChild('email').equalTo(email).once("value", function(snapshot) {
            rs = snapshot.exists();
            if (rs) {
                return done(null, false, req.flash('message', 'El usuario ya está Registrado'));
            } else {
                db.ref('users').push(newUser);
                return done(null, null, req.flash('success', 'Usuario Registrado'));
            }
        });
    } else {
        return done(null, false, req.flash('message', 'Las Contraseñas no coinciden'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    const tablaref = db.ref('users');
    var res;
    tablaref.orderByChild('email').equalTo(email).on("child_added", function(snapshot) {
        res = snapshot.val();
        done(null, res);
    });
});