// Login tradicional (ejemplo)
const login = async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario Veterinario o Paciente
  let usuario = await Veterinario.findOne({ email });
  let rol = "veterinario";

  if (!usuario) {
    usuario = await Paciente.findOne({ email });
    rol = "paciente";
  }

  if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

  // Validar password (asegúrate que tienes método comprobarPassword)
  const isValid = await usuario.comprobarPassword(password);
  if (!isValid) return res.status(401).json({ msg: "Contraseña incorrecta" });

  // Generar token JWT propio
  const token = crearTokenJWT(usuario._id, rol);

  res.json({
    token,
    rol,
  });
};

// Login con Google
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.VITE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Buscar usuario en la BD por email
    let usuario = await Veterinario.findOne({ email: payload.email });
    let rol = "veterinario";

    if (!usuario) {
      usuario = await Paciente.findOne({ email: payload.email });
      rol = "paciente";
    }

    if (!usuario) return res.status(401).json({ msg: "Usuario no registrado en la base de datos" });

    // Generar token JWT propio para frontend
    const token = crearTokenJWT(usuario._id, rol);

    res.json({
      token,
      rol,
    });
  } catch (error) {
    console.error("Error validando token Google:", error);
    res.status(401).json({ msg: "Token Google inválido" });
  }
};

export {
  crearTokenJWT,
  verificarTokenJWT,
  login,
  googleLogin,
};


