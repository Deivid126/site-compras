#!/bin/sh
set -e

echo "== Sincronizando banco de dados =="
./node_modules/.bin/prisma db push --skip-generate

echo "== Carregando presentes (seed) =="
node prisma/dist/seed.js

echo "== Iniciando aplicacao =="
exec npm run start
