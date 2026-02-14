# Backend – Sistema de Gestión Empresarial
## Descripción
Este proyecto corresponde al **backend** del Trabajo Fin de Máster (TFM).  
Implementa una API REST desarrollada en **Node.js** con **Express**, encargada de la gestión de empresas, persistencia de datos y exposición de servicios para el frontend.

El backend ha sido diseñado siguiendo buenas prácticas de arquitectura, validación de datos y pruebas automatizadas.

## Tecnologías utilizadas
- Node.js
- Express.js
- JavaScript (ES Modules)
- Almacenamiento local (archivo JSON)
- Jest (pruebas unitarias)
- Supertest (pruebas de integración)
- OpenTelemetry (observabilidad)
- Docker (opcional)

## Ejecución AMBIENTE DE DESARROLLO SIN DOCKER
## Modo desarrollo
- npm run dev
## Modo pruebas
- $env:NODE_ENV="test" 
- npm test
## Modo producción
- npm start

## Ejecución AMBIENTE DE DESARROLLO CON DOCKER
## backend y frontend (Desarrollo)
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
## backend y frontend (Producción)
# Primero creamos la imagen
docker build -f Dockerfile.prod -t backend:test .
# Levantamos el docker
docker run `
  -p 3000:3000 `
  -e DATA_DIR=/app/data `
  -v C:\TFM\tfm-devops-app-demo-node-react\app-demo-node-react\backend\src\data:/app/data `
  backend:test


docker compose -f docker-compose.prod.yml up
## Construcción de imágenes de producción
docker build -t app-backend:1.0.0 ./backend
docker build -t app-frontend:1.0.0 ./frontend

## PROBAR LOCALMENTE
# Backend
cd app-demo-node-react/backend
docker build -f Dockerfile.prod -t backend:test .
docker run -p 3000:3000 backend:test

# Frontend
cd ../frontend
docker build -f Dockerfile.prod -t frontend:test .
docker run -p 80:80 frontend:test
## FIN PROBAR LOCALMENTE 

## Trivy
## backend y frontend (Desarrollo)
trivy image app-demo-node-react-backend:latest
trivy image app-demo-node-react-frontend:latest

## Trivy
## backend y frontend (Desarrollo)
trivy image --format cyclonedx --output sbom-backend.json app-demo-node-react-backend:latest
trivy image --format cyclonedx --output sbom-frontend.json app-demo-node-react-frontend:latest

## DockerHUB 
docker tag app-demo-node-react-backend:latest jsaenz72/app-backend:1.0.0
docker tag app-demo-node-react-frontend:latest jsaenz72/app-frontend:1.0.0

docker push jsaenz72/app-backend:1.0.0
docker push jsaenz72/app-frontend:1.0.0

## Cosign 
# Firmar FRONTEND 
cosign-windows-amd64 sign jsaenz72/app-backend:1.0.0
cosign-windows-amd64 sign jsaenz72/app-frontend:1.0.0

# Verificar BACKEND
cosign-windows-amd64  verify --certificate-identity jsaenz72@hotmail.com --certificate-oidc-issuer https://login.microsoftonline.com jsaenz72/app-backend:1.0.0

cosign-windows-amd64  verify --certificate-identity jsaenz72@hotmail.com --certificate-oidc-issuer https://login.microsoftonline.com jsaenz72/app-frontend:1.0.0

## DockerHub
Para utilizar el token de acceso desde su cliente Docker CLI:
1. Correr
docker login -u jsaenz72
2. En la solicitud de contraseña, ingrese el token de acceso personal.
<DOCKER_PERSONAL_ACCESS_TOKEN>

## ArgoCD
# Borrar el cluster
k3d cluster delete tfm-gitops

# Crear el cluster 
k3d cluster create tfm-gitops \
  --agents 2 \
  --servers 1 \
  --port "80:80@loadbalancer" \
  --port "443:443@loadbalancer"

kubectl apply -k k8s/base

# Forzar que ArgoCD vuelva a crear los pods
kubectl annotate application demo-app -n argocd \
  argocd.argoproj.io/refresh=hard --overwrite

kubectl get pods -n demo-app

# Borrar pods manualmente
kubectl delete pod -n demo-app -l app=frontend

# Recrea los pods frontend
kubectl rollout restart deployment frontend -n demo-app
# Ingresar al POD 
kubectl exec -it -n demo-app deploy/backend -- sh

# Password de ArgoCD
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d

oi9TarTKB9Cla7-u
