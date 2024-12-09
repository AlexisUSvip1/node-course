const bcrypt = require("bcrypt"); // Para el hashing de contraseñas
const express = require("express");
const app = express();

let users = []; // Simulamos la base de datos con un arreglo en memoria
// Función para manejar el registro de un usuario
const registerUser = async (req, res) => {
  const { email, password, displayName, age, date } = req.body;

  // Verificar que los campos no estén vacíos
  if (!email || !password || !displayName || !age || !date) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  // Validar el formato del email (puedes agregar más validaciones aquí)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "El correo electrónico no tiene un formato válido." });
  }

  // Verificar si el usuario ya existe
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "Usuario ya registrado" });
  }

  try {
    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      displayName,
      email,
      password: hashedPassword,
      age,
      date,
    };

    // Agregar el nuevo usuario al arreglo de usuarios (simulando la base de datos)
    users.push(newUser);

    // Iniciar sesión automáticamente (simulación de sesión)
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al iniciar sesión" });
      }
      return res.json({ message: "Cuenta creada con éxito", user: newUser });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener usuarios registrados (solo para prueba)
const getUsersRegister = (req, res) => {
  console.log(users);
  return res.json(users);
};

module.exports = { registerUser, getUsersRegister };
