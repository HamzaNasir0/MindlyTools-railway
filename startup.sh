#!/bin/bash env
set -e
cd client && npm install; npm run build && npm start
echo "Client installed and runnning"
cd ../server && npm install; npm start
echo "Server installed and running"
