const express = require("express");
const passport = require("passport");
const router = express.Router();

// Importa el controlador de Google
const googleAuth = require("../Controllers/authGoogle");
// Importa el controlador de Facebook
const facebookAuth = require("../Controllers/authFacebook");

// Rutas de Google
router.get("/google", googleAuth.authenticate);
router.get("/google/callback", googleAuth.callback);

// Rutas de Facebook
router.get("/facebook", facebookAuth.authenticate);
router.get("/facebook/callback", facebookAuth.callback);
router.get("/facebook/success", facebookAuth.success);
router.get("/facebook/error", facebookAuth.error);
router.get("/facebook/signout", facebookAuth.signout);

// Ruta para obtener los datos del usuario autenticado
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Devuelve los datos del usuario autenticado
  } else {
    res.status(401).json({ error: "Usuario no autenticado" });
  }
});

module.exports = router;