import { app } from "./app";

const PORT = process.env.PORT || 3333;

const servidor = app.listen(PORT, () => {
    console.log("==============================================================");
    console.log("⚔️  FRACTURE: THE VASLEN ECHOES - API RESTful ONLINE");
    console.log(`🌐 Servidor rodando com sucesso em: http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponíveis:`);
    console.log(`   - Status:      GET    http://localhost:${PORT}/api/status`);
    console.log(`   - Auth:        POST   http://localhost:${PORT}/api/auth/cadastro`);
    console.log(`   - Auth:        POST   http://localhost:${PORT}/api/auth/login`);
    console.log(`   - Personagens: GET/POST http://localhost:${PORT}/api/personagens`);
    console.log(`   - Códice:      GET    http://localhost:${PORT}/api/codice`);
    console.log(`   - Combate:     POST   http://localhost:${PORT}/api/combate/iniciar`);
    console.log("==============================================================");
});

export { servidor };
