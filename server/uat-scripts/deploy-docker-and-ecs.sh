# Push Docker Image
#cp ~/byjus-secrets/webhooks.env server/.env
./uat-scripts/deploy-docker.sh uat

# Push ECS Tasks
cd uat-scripts
./deploy-ecs.sh byjus-mk-app-server
