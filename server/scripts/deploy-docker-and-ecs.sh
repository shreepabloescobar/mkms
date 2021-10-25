# Push Docker Image
# cp ~/byjus-secrets/webhooks.env .env
./scripts/deploy-docker.sh dev

# Push ECS Tasks
cd scripts
./deploy-ecs.sh byjus-mk-app-server
