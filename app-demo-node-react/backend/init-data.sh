#!/bin/sh

DATA_DIR="/app/src/data"
VOLUME_DIR="/app/src/data"

# Si el volumen está vacío, copiamos los JSON iniciales
if [ -z "$(ls -A $VOLUME_DIR 2>/dev/null)" ]; then
  echo "Inicializando volumen con datos JSON..."
  cp -R /app/src/data-init/* $VOLUME_DIR/
else
  echo "Volumen ya contiene datos, no se copian archivos."
fi

# Arranca la app
exec npx nodemon src/index.js
