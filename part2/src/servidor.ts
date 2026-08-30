import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUERTO = process.env.PORT || 3000;

const Servidor = http.createServer((req: any, res: any) => {
    const archivo = path.join(__dirname, "..", "public", "index.html");

    fs.readFile(archivo, (error, contenido) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Archivo no encontrado");
            return;
        }

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(contenido);
    });
});

Servidor.listen(PUERTO, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PUERTO}`);
});