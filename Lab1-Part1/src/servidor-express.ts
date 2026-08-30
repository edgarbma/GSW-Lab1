import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3001;

app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 30, 
    message: { error: "Demasiadas peticiones, intente más tarde." }
});

app.use(limiter);

interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

const usuarios: Usuario[] = [
    { id: 1, nombre: "Edgar", email: "edgar@example.com" },
    { id: 2, nombre: "Sophia", email: "sophia@example.com" },
    { id: 3, nombre: "Armando", email: "armando@example.com" }
];

// Obtener todos los usuarios
app.get("/api/usuarios", (req: Request, res: Response) => {
    res.json(usuarios);
});

app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/usuarios/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
});

app.post("/api/usuarios", (req: Request, res: Response) => {
    const { nombre, email } = req.body;

    if (!nombre || !email || nombre.trim() === "" || email.trim() === "") {
    return res.status(400).json({ error: "Nombre y email son requeridos" });
    }

    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const nuevoUsuario: Usuario = {
        id: nuevoId,
        nombre: nombre.trim(),
        email: email.trim()
    };

    usuarios.push(nuevoUsuario);

    res.status(201).json(nuevoUsuario);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); 
    res.status(500).json({ error: "Ocurrió un error interno en el servidor" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost/${PORT}`);
});