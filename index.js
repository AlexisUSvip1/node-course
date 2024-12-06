require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./src/Graphql/schema");

// Importa las rutas de autenticación
const authRouter = require("./src/Routers/auth");

const app = express();

// Configura la sesión de Express
app.use(
  session({
    secret: "secret", // Clave para firmar las sesiones
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Cambia a true si usas HTTPS
  })
);

// Configurar CORS (solo necesitas una vez)
app.use(
  cors({
    origin: "http://localhost:5173", // Permite solicitudes solo desde esta URL
    methods: ["GET", "POST"], // Métodos permitidos
    credentials: true, // Asegura que las credenciales como cookies se envíen
  })
);

// Configurar el endpoint de GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Activa la interfaz gráfica de GraphQL
  })
);

// Inicializa Passport y la sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Usar las rutas de autenticación
app.use("/auth", authRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("Error 404: Página no encontrada");
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack); // Registra el error en la consola
  res.status(500).send("Error 500: Error interno del servidor");
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
