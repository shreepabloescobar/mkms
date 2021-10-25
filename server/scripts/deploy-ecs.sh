#!/bin/bash
export CLUSTER_NAME="development-locus-ecs-cluster"
export MS_NAME="byjus-mk-app-server"
export SERVICE_NAME="development-${MS_NAME}-service"
export TASK_FAMILY="development-${MS_NAME}-td"
export FILE_NAME=`echo ${TASK_FAMILY}|sed 's/-/_/g'`

#Register/Update task defintion
#aws2 ecs register-task-definition --family ${TASK_FAMILY} --cli-input-json "file://${FILE_NAME}.json"

#Get the latest task revision using the describe task defintion
#TASK_REVISION=`aws2 ecs describe-task-definition --task-definition ${TASK_FAMILY} | egrep "revision" | tr "/" " " | awk '{print $2}' | sed 's/,//'`

#Get the desired count of the service
#DESIRED_COUNT=`aws2 ecs describe-services --cluster ${CLUSTER_NAME} --services ${SERVICE_NAME} | egrep "desiredCount" | tr "/" " " | awk '{print $2}' | sed 's/,$//' | awk 'NR==1'`

#Update service on ecs
#aws2 ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --task-definition ${TASK_FAMILY}:${TASK_REVISION} --desired-count ${DESIRED_COUNT}
aws2 ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --force-new-deployment 
