#!/bin/bash
export NODE_ENV=$1
export IMAGE_NAME="microservices-mkms-image"
export PROFILE_ID=$([ "$NODE_ENV" = "dev" ] && echo "733716689918" || echo "602393328267")

cd server
sudo $(aws2 ecr get-login --no-include-email --region ap-south-1)
sudo docker build -t  $IMAGE_NAME .
sudo docker tag $IMAGE_NAME:latest ${PROFILE_ID}.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest
sudo docker push ${PROFILE_ID}.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest
