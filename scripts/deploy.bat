@echo off
setlocal enabledelayedexpansion

set BRANCH=develop
set MESSAGE=%1

if "%MESSAGE%"=="" (
    set MESSAGE=feat: nueva versión backend para rollout canary
)

echo ==============================================
echo 🚀 Iniciando despliegue GitOps
echo 📌 Rama: %BRANCH%
echo 📌 Mensaje: %MESSAGE%
echo ==============================================

echo 🔍 Verificando estado del repositorio...
git status

echo 📦 Agregando cambios...
git add .

echo 📝 Creando commit...
git commit -m "%MESSAGE%" || echo ⚠️ No hay cambios para commitear

echo 🔄 Actualizando rama local con rebase...
git pull --rebase origin %BRANCH%

echo ⬆️ Enviando cambios a GitHub...
git push origin %BRANCH%

echo ==============================================
echo 🎉 Push realizado. GitHub Actions iniciará CI/CD.
echo ==============================================

echo 📡 Abre GitHub Actions para ver el pipeline:
echo https://github.com/jsaenz72/tfm-devops-app-demo-node-react/actions

echo ==============================================
echo 📡 Monitoreando rollout en tiempo real...
echo ==============================================

kubectl argo rollouts get rollout backend -n demo-app --watch

echo ==============================================
echo 📜 Logs del backend (canary + stable)...
echo ==============================================

kubectl logs -n demo-app -l app=backend -f
