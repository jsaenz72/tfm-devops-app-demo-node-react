# README.md
```markdown
# app-demo-node-react
Proyecto de ejemplo para TFM DevOps. Incluye backend Node.js (Express) y frontend React, Dockerfiles y docker-compose.
## Estructura de archivos
app-demo-node-react/
├── backend/
│ ├── package.json
│ ├── Dockerfile
│ ├── .dockerignore
│ └── src/
│ ├── index.js
│ ├── routes/
│ │ └── items.js
│ └── data.json
│ └── tests/
│ └── items.test.js
├── frontend/
│ ├── package.json
│ ├── Dockerfile
│ ├── .dockerignore
│ └── src/
│ ├── index.jsx
│ └── App.jsx
├── docker-compose.yml
├── .gitignore
└── README.md
## Requisitos
- Docker / Docker Desktop
- Node 18 (si ejecutas localmente sin Docker)
## Ejecutar con Docker Compose

```bash
docker-compose up --build
```

- Backend disponible en http://localhost:3000/api/items
- Frontend disponible en http://localhost:8080 (proxied to /api)

## Ejecutar tests backend

```bash
cd backend
npm ci
npm test
```
## Siguientes pasos sugeridos
1. Añadir GitHub Actions con pasos: test, build, trivy, sbom, cosign, push.
2. Crear repos: `app-demo`, `infra`, `gitops-config`.
3. Dockerizar para registry local y preparar manifiestos K8s.
