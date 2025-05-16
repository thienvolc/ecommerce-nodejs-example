#!/bin/sh

CONTAINER_NAME=mongodb

docker exec -it $CONTAINER_NAME mongosh
