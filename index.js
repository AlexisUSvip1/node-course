// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

// Importa las dependencias necesarias
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Crea la aplicación Express
const app = express();

// Configura el middleware para manejar sesiones
app.use(
  session({
    secret: "secret", // Clave para firmar las sesiones
    resave: false, // No guarda la sesión si no hay cambios
    saveUninitialized: true, // Guarda sesiones no inicializadas
  })
);

// Inicializa Passport y conecta la sesión al middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configura la estrategia de autenticación de Google con Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // ID del cliente proporcionado por Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Clave secreta del cliente
      callbackURL: "http://localhost:3000/auth/google/callback", // URL de retorno después de la autenticación
    },
    // Callback que se ejecuta al completar la autenticación
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile); // Devuelve el perfil del usuario autenticado
    }
  )
);

// Serializa al usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => done(null, user));

// Deserializa al usuario desde la sesión
passport.deserializeUser((user, done) => done(null, user));

// Ruta raíz con un enlace para iniciar sesión con Google
// app.get("/", (req, res) => {
//   res.send("<a href='/auth/google'>Login with Google</a>");
// });

// Ruta para manejar la autenticación con Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }) // Solicita acceso al perfil y correo del usuario
);

// Ruta de callback después de la autenticación
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }), // Redirige a "/" en caso de fallo
  (req, res) => {
    res.redirect("/home"); // Redirige a la página de perfil en caso de éxito
  }
);

// Ruta para mostrar la página de perfil del usuario autenticado
app.get("/profile", (req, res) => {
  res.send(`Welcome ${req.user.displayName}`); // Muestra el nombre del usuario
});

// Ruta para cerrar la sesión
app.get("/logout", (req, res) => {
  req.logout(() => {
    // Cierra la sesión del usuario
    res.redirect("/"); // Redirige a la página de inicio
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("Error 404: Página no encontrada");
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack); // Opcional: registra el error en la consola
  res.status(500).send("Error 500: Error interno del servidor");
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
