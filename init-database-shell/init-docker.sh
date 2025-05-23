#!/bin/sh

VOLUME_NAME=mongodb-data
PORT_MAPPING=27017:27017
VOLUME_MAPPING=$VOLUME_NAME:/data/db
CONTAINER_NAME=mongodb
DOCKER_IMAGE=mongo 

docker volume create $VOLUME_NAME 
docker run -d -p $PORT_MAPPING -v $VOLUME_MAPPING --name $CONTAINER_NAME $DOCKER_IMAGE
