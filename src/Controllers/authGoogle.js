const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

/// Autenticación con Google
exports.authenticate = passport.authenticate("google", {
  scope: ["profile", "email"], // Los datos que solicitamos de Google
});

// Callback después de la autenticación
exports.callback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/"); // Si no se autentica correctamente, redirige a la página principal
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        // Redirige al frontend después de la autenticación
        res.redirect("http://localhost:5173/inicio");
      });
    }
  )(req, res, next);
};

// Configura la estrategia de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Debes definir este valor en tu archivo .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Debes definir este valor en tu archivo .env
      callbackURL: "http://localhost:3000/auth/google/callback", // Esta es la URL de callback
    },
    function (token, tokenSecret, profile, done) {
      // Aquí puedes guardar el perfil del usuario en tu base de datos
      return done(null, profile);
    }
  )
);

// Serialización y deserialización del usuario
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
