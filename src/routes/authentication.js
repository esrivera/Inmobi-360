const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const passport = require('passport');
const admin = require('../database');
const db = admin.database();

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.status(200).render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/signin',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signupA', isNotLoggedIn, (req, res) => {
    res.status(200).render('auth/signupA');
});

router.post('/signupA', isNotLoggedIn, passport.authenticate('local.signupA', {
    successRedirect: '/signin',
    failureRedirect: '/signupA',
    failureFlash: true
}));

router.get('/signupC', isNotLoggedIn, (req, res) => {
    res.status(200).render('auth/signupC');
});

router.post('/signupC', isNotLoggedIn, passport.authenticate('local.signupC', {
    successRedirect: '/signin',
    failureRedirect: '/signupC',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    const { email } = req.body;
    db.ref('users').orderByChild('email').equalTo(email).once("value", function(snapshot) {
        const rs = snapshot.exists();
        if (!rs) {
            passport.authenticate('local.signin', {
                successRedirect: '/profile',
                failureRedirect: '/signin',
                failureFlash: true
            })(req, res, next)
        } else {
            db.ref('users').orderByChild('email').equalTo(email).once("child_added", function(snapshot) {
                const user = snapshot.val();
                if (user.type_user === 'Propietario') {
                    passport.authenticate('local.signin', {
                        successRedirect: '/profile',
                        failureRedirect: '/signin',
                        failureFlash: true
                    })(req, res, next)
                } else if (user.type_user === 'Agente') {
                    passport.authenticate('local.signin', {
                        successRedirect: '/profileA',
                        failureRedirect: '/signin',
                        failureFlash: true
                    })(req, res, next)
                } else {
                    passport.authenticate('local.signin', {
                        successRedirect: '/profileC',
                        failureRedirect: '/signin',
                        failureFlash: true
                    })(req, res, next)
                }

            });
        }
    });

});

router.post('/edit', isLoggedIn, (req, res) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { ciudad } = req.body;
    const { telefono } = req.body;
    const { passwordc } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const type = 'Propietario';
    if (password === passwordc) {
        db.ref('users').orderByChild('email').equalTo(email).once("child_added", async function(snapshot) {
            const id = snapshot.key;
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
            db.ref('users/' + id).update(newUser);
            req.flash('success', 'Información Editada Satisfactoriamente');
            res.redirect('/profile');
        });
    } else {
        req.flash('message', 'No coinciden las Claves');
    }

});

router.post('/editA', isLoggedIn, (req, res) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { ciudad } = req.body;
    const { telefono } = req.body;
    const { passwordc } = req.body;
    const { email } = req.body;
    const { razon } = req.body;
    const { password } = req.body;
    const type = 'Agente';
    if (password === passwordc) {
        db.ref('users').orderByChild('email').equalTo(email).once("child_added", async function(snapshot) {
            const id = snapshot.key;
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
            db.ref('users/' + id).update(newUser);
            req.flash('success', 'Información Editada Satisfactoriamente');
            res.redirect('/profileA');
        });
    } else {
        req.flash('message', 'No coinciden las Claves');
    }

});

router.post('/editC', isLoggedIn, (req, res) => {
    const { contacto } = req.body;
    const { direccion } = req.body;
    const { ciudad } = req.body;
    const { telefono } = req.body;
    const { passwordc } = req.body;
    const { email } = req.body;
    const { razon } = req.body;
    const { password } = req.body;
    const type = 'Inmobiliaria-Constructora';
    if (password === passwordc) {
        db.ref('users').orderByChild('email').equalTo(email).once("child_added", async function(snapshot) {
            const id = snapshot.key;
            const clave = await helpers.encryptPassword(password);
            let newUser = {
                contacto: contacto,
                direccion: direccion,
                email: email,
                password: clave,
                ciudad: ciudad,
                telefono: telefono,
                razon_social: razon,
                type_user: type
            };
            db.ref('users/' + id).update(newUser);
            req.flash('success', 'Información Editada Satisfactoriamente');
            res.redirect('/profileC');
        });
    } else {
        req.flash('message', 'No coinciden las Claves');
    }

});
router.get('/direct/:id', isLoggedIn, (req, res) => {
    const { id } = req.params;
    if (id === 'Propietario') {
        res.redirect('/profile');
    } else if (id === 'Inmobiliaria-Constructora') {
        res.redirect('/profileC');
    } else {
        res.redirect('/profileA');
    }
});
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('users/profile');
});
router.get('/profileA', isLoggedIn, (req, res) => {
    res.render('users/profileA');
});
router.get('/profileC', isLoggedIn, (req, res) => {
    res.render('users/profileC');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;