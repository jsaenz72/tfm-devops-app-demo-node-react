
# README.md

```markdown
# app-demo-node-react

Proyecto de ejemplo para TFM DevOps. Incluye backend Node.js (Express) y frontend React, Dockerfiles y docker-compose.

## Requisitos
- Docker / Docker Desktop
- Node (si ejecutas localmente sin Docker)

## Ejecutar con Docker Compose

```bash
docker-compose up --build
```

- Backend disponible en http://localhost:3000/api/items
- Swagger  disponible en http://localhost:3000/api-docs/#/
- Frontend disponible en http://localhost:8090 (proxied to /api)


## Ejecutar tests backend

```bashbacke    
cd backend
npm ci
npm test
```

## Siguientes pasos sugeridos
1. Añadir GitHub Actions con pasos: test, build, trivy, sbom, cosign, push.
2. Crear repos: `app-demo`, `infra`, `gitops-config`.
3. Dockerizar para registry local y preparar manifiestos K8s.