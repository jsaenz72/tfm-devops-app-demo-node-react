#!/bin/bash

echo " Iniciando despliegue de infraestructura TFM..."

# Verificar pre-requisitos
command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker no está instalado"; exit 1; }
command -v k3d >/dev/null 2>&1 || { echo "ERROR: k3d no está instalado"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "ERROR: kubectl no está instalado"; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "ERROR: Terraform no está instalado"; exit 1; }

echo "✅ Pre-requisitos verificados"

# Desplegar con Terraform
cd terraform
terraform init
terraform apply -auto-approve

echo "✅ Infraestructura desplegada"

# Mostrar información
echo ""
echo "📊 URLs de acceso:"
echo "  Argo CD: http://localhost:30080"
echo "  Grafana: http://localhost:30030"
echo "  Prometheus: http://localhost:30090"
echo "  Argo Rollouts: http://localhost:31000"
echo ""
echo "🔑 Contraseña de Argo CD:"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo ""