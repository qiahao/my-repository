#!/bin/sh

if docker service ls -f name=$PROJECT_NAME | grep $PROJECT_NAME; then \
  docker service rm $PROJECT_NAME \
;fi

docker service create --name $PROJECT_NAME --network haproxy -e SERVICE_PORTS=$SERVICE_PORT -e VIRTUAL_HOST=$HOST_TESTING $CI_REGISTRY_IMAGE:testing
  
