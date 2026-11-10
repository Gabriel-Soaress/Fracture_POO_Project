@echo off
chcp 65001 >nul
title Fracture: The Vaslen Echoes - Inicializador

set "ROOT_DIR=%~dp0"

echo ==============================================================
echo   FRACTURE: THE VASLEN ECHOES - INICIALIZADOR AUTOMATICO
echo ==============================================================
echo.

:: Verifica se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado! Instale o Node.js antes de continuar.
    pause
    exit /b 1
)

:: Verifica se o arquivo .env existe no backend
if not exist "%ROOT_DIR%backend\.env" (
    echo [AVISO] Arquivo backend\.env nao encontrado!
    echo Certifique-se de configurar DATABASE_URL, PORT e JWT_SECRET antes de rodar.
    pause
    exit /b 1
)

:: Instala dependencias automaticamente caso ainda nao existam (ex: outro PC)
if not exist "%ROOT_DIR%backend\node_modules" (
    echo [Setup] Instalando dependencias do Backend...
    pushd "%ROOT_DIR%backend"
    call npm install
    call npx prisma generate
    popd
)

if not exist "%ROOT_DIR%frontend\node_modules" (
    echo [Setup] Instalando dependencias do Frontend...
    pushd "%ROOT_DIR%frontend"
    call npm install
    popd
)

:: Libera portas 3333 e 5173 caso alguma instancia anterior tenha ficado aberta
echo [1/3] Verificando portas 3333 e 5173...
powershell -NoProfile -Command "$ports = @(3333, 5173); foreach ($p in $ports) { Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"

:: Inicia Backend e Frontend em janelas minimizadas
echo [2/3] Iniciando Servidor Backend (porta 3333) e Frontend (porta 5173)...
start "Vaslen Backend" /MIN /D "%ROOT_DIR%backend" cmd /k "npm run iniciar"
start "Vaslen Frontend" /MIN /D "%ROOT_DIR%frontend" cmd /k "npm run dev"

:: Aguarda ambos os servidores ficarem prontos antes de abrir o navegador
echo [3/3] Aguardando servidores responderem...
powershell -NoProfile -Command "for ($i=0; $i -lt 40; $i++) { try { $b = Invoke-WebRequest -Uri 'http://localhost:3333/api/status' -UseBasicParsing -TimeoutSec 1; $f = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 1; if ($b.StatusCode -eq 200 -and $f.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; exit 1"

if %errorlevel% equ 0 (
    echo.
    echo [OK] Tudo pronto! Abrindo o jogo no navegador...
    start "" "http://localhost:5173"
) else (
    echo.
    echo [AVISO] Os servidores demoraram mais que o esperado, tentando abrir mesmo assim...
    start "" "http://localhost:5173"
)

echo.
echo ==============================================================
echo   JOGO RODANDO EM: http://localhost:5173
echo   API RODANDO EM:  http://localhost:3333
echo.
echo   NAO FECHE ESTA JANELA DURANTE A APRESENTACAO.
echo   Quando terminar, pressione qualquer tecla aqui para
echo   encerrar o Backend e o Frontend com seguranca.
echo ==============================================================
pause >nul

echo.
echo Encerrando servidores...
taskkill /FI "WINDOWTITLE eq Vaslen Backend*" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Vaslen Frontend*" /T /F >nul 2>nul
powershell -NoProfile -Command "$ports = @(3333, 5173); foreach ($p in $ports) { Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"
echo Servidores encerrados. Ate logo!
timeout /t 2 >nul