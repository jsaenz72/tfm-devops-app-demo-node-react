#!/bin/bash
set -e

BRANCH="develop"
MESSAGE="${1:-feat: nueva versión backend para rollout canary}"

echo "=============================================="
echo "🚀 Iniciando despliegue GitOps"
echo "📌 Rama: $BRANCH"
echo "📌 Mensaje: $MESSAGE"
echo "=============================================="

# 1. Verificar estado del repo
echo "🔍 Verificando estado del repositorio..."
git status

# 2. Agregar cambios
echo "📦 Agregando cambios..."
git add .

# 3. Commit
echo "📝 Creando commit..."
git commit -m "$MESSAGE" || echo "⚠️ No hay cambios para commitear"

# 4. Rebase opcional para evitar conflictos
echo "🔄 Actualizando rama local con rebase..."
git pull --rebase origin $BRANCH || true

# 5. Push
echo "⬆️ Enviando cambios a GitHub..."
git push origin $BRANCH

echo "=============================================="
echo "🎉 Push realizado. GitHub Actions iniciará CI/CD."
echo "⏳ Esperando 10 segundos para iniciar monitoreo..."
echo "=============================================="

sleep 10

# 6. Mostrar estado del pipeline
echo "📡 Abre GitHub Actions para ver el pipeline:"
echo "👉 https://github.com/jsaenz72/tfm-devops-app-demo-node-react/actions"

# 7. Monitorear rollout en tiempo real
echo "=============================================="
echo "📡 Monitoreando rollout en tiempo real..."
echo "=============================================="

kubectl argo rollouts get rollout backend -n demo-app --watch &

# 8. Logs del backend
echo "=============================================="
echo "📜 Logs del backend (canary + stable)..."
echo "=============================================="

kubectl logs -n demo-app -l app=backend -f &
