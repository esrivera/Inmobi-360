const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const admin = require('../database');
const db = admin.database();
const sleep = require('sleep');

//AÑADIR
router.get('/inmuebles', isNotLoggedIn, (req, res) => {
    db.ref('users').once("value", async function(snapshot) {
        let firebasedata = [];
        let idUsers = [];
        snapshot.forEach(x => {
            firebasedata.push(x.val())
        });
        var i = 0;
        while (i < firebasedata.length) {
            db.ref('users').orderByChild('email').equalTo(firebasedata[i].email).once("child_added", function(snapshot) {
                idUsers.push(snapshot.key);
            });
            i++;
        }
        setTimeout(function() {
            console.log(idUsers);
            return res.render('inmuebles/list');
        }, 500);
    });
});

router.get('/detalle', isNotLoggedIn, (req, res) => {
    res.render('inmuebles/detail');
});


router.get('/add', isLoggedIn, (req, res) => {
    res.render('inmuebles/add');
});

router.post('/add', (req, res) => {
    const {
        tipo_anuncio,
        tipo_inmueble,
        precio,
        area,
        provincia,
        ciudad,
        direccion,
        referencia,
        nombre,
        email,
        telefono,
        titulo,
        descripcion,
        habitacion,
        banio,
        piso,
        usuario
    } = req.body;
    const { dias } = req.body;
    const { horas } = req.body;
    const newInmueble = {
        tipo_anuncio: tipo_anuncio,
        tipo_inmueble: tipo_inmueble,
        precio: precio,
        area: area,
        provincia: provincia,
        ciudad: ciudad,
        direccion: direccion,
        referencia: referencia,
        nombre_contacto: nombre,
        email_contacto: email,
        telefono_contacto: telefono,
        titulo: titulo,
        descripcion: descripcion,
        habitaciones: habitacion,
        banios: banio,
        pisos: piso,
        horas: horas,
        dias: dias
    };
    db.ref('users').orderByChild('email').equalTo(usuario).once("child_added", function(snapshot) {
        const id = snapshot.key;
        db.ref('users/' + id + '/anuncios').push(newInmueble);
        console.log(newInmueble);
        req.flash('success', 'Anuncio Generado Satisfactoriamente');
        res.redirect('/add');
    });
});

//LISTAR
router.get('/anuncios', isLoggedIn, (req, res) => {
    db.ref('users').orderByChild('email').equalTo(req.app.locals.user.email).once("child_added", function(snapshot) {
        const id = snapshot.key;
        db.ref('users/' + id + '/anuncios').once("value", function(snapshot) {
            const links = snapshot.val();
            return res.render('inmuebles/anuncio', { links });
        });
    });
});

router.get('/mensajes', isLoggedIn, (req, res) => {
    db.ref('users').orderByChild('email').equalTo(req.app.locals.user.email).once("child_added", function(snapshot) {
        const id = snapshot.key;
        db.ref('users/' + id + '/mensajes').once("value", function(snapshot) {
            const links = snapshot.val();
            return res.render('inmuebles/mensajes', { links });
        });
    });
});

//ELIMINAR
router.delete('/delete/:id', isLoggedIn, (req, res) => {
    db.ref('users').orderByChild('email').equalTo(req.app.locals.user.email).once("child_added", function(snapshot) {
        const id = snapshot.key;
        db.ref('users/' + id + '/anuncios/' + req.params.id).remove();
        req.flash('success', 'Anuncio Eliminado Satisfactoriamente');
        return res.redirect('/anuncios');
    });
});

router.delete('/eliminar/:id', isLoggedIn, (req, res) => {
    db.ref('users').orderByChild('email').equalTo(req.app.locals.user.email).once("child_added", function(snapshot) {
        const id = snapshot.key;
        db.ref('users/' + id + '/mensajes/' + req.params.id).remove();
        req.flash('success', 'Mensaje Eliminado Satisfactoriamente');
        return res.redirect('/mensajes');
    });
});


module.exports = router;