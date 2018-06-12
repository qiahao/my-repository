#!/bin/sh

if docker service ls -f name=$EMU_PROJECT_NAME | grep $EMU_PROJECT_NAME; then \
  docker service rm $EMU_PROJECT_NAME \
;fi

docker service create --name $EMU_PROJECT_NAME \
  --network haproxy -e SERVICE_PORTS=$SERVICE_PORT -e VIRTUAL_HOST='tms-staging.yunba.com' \
  $CI_REGISTRY_IMAGE:staging
