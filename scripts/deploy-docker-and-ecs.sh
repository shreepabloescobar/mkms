# Push Docker Image
# cp ~/byjus-secrets/oms.env server/.env
./scripts/deploy-docker.sh dev mkms

# Push ECS Tasks
cd scripts
./deploy-ecs.sh mkms
