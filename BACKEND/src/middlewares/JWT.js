import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import Administrador from "../models/Administrador.js"
import Estudiante from "../models/Estudiante.js"

// Cliente de Google para validar idTokens
const client = new OAuth2Client(process.env.VITE_CLIENT_ID)

const crearTokenJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization)
    return res.status(401).json({ msg: "Acceso denegado: token no proporcionado o inválido" })

  const token = authorization.split(" ")[1]

  try {
    // Verificar token JWT normal
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)

    if (rol === "administrador") {
      req.administradorBDD = await Administrador.findById(id).lean().select("-password")
      return next()
    } else {
      req.estudianteBDD = await Estudiante.findById(id).lean().select("-password")
      return next()
    }
  } catch (error) {
    // Si falla, verificar token de Google
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.VITE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      // Buscar usuario en BD por email
      let usuario = await Administrador.findOne({ email: payload.email }).lean().select("-password")
      if (usuario) {
        req.administradorBDD = usuario
        return next()
      }

      usuario = await Estudiante.findOne({ email: payload.email }).lean().select("-password")
      if (usuario) {
        req.estudianteBDD = usuario
        return next()
      }

      return res.status(401).json({ msg: "Usuario no registrado en la base de datos" })
    } catch {
      return res.status(401).json({ msg: "Token inválido o expirado" })
    }
  }
}

export {
  crearTokenJWT,
  verificarTokenJWT,
}
