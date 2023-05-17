#!/bin/bash

# Obtener la ID del contenedor MangList_API-REST
CONTAINER_ID=$(docker ps --filter "name=MangList_API-REST" --format "{{.ID}}")

# Detener el contenedor
docker stop "$CONTAINER_ID"

docker container prune
docker image prune

# Obtener los cambios más recientes del repositorio de Git
git fetch
git pull

# Construir el contenedor
docker-compose build

# Volver a ejecutar el contenedor en segundo plano
docker-compose up -d