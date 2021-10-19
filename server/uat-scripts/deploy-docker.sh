#!/bin/bash
export NODE_ENV=$1
export IMAGE_NAME="uat-byjus-mk-app-server-image"
export PROFILE_ID=$([ "$NODE_ENV" = "uat" ] && echo "733716689918" || echo "602393328267")

$(aws ecr get-login --no-include-email --region ap-south-1)
docker build -t  $IMAGE_NAME .
docker tag $IMAGE_NAME:latest ${PROFILE_ID}.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest
docker push ${PROFILE_ID}.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest
