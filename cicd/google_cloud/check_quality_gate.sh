#!/bin/sh

PROJECT_KEY=lolo-frontend-dev
SONAR_HOST=http://34.41.62.92:9001
SONAR_TOKEN=$1

CE_TASK_ID=$(curl -u $SONAR_TOKEN: $SONAR_HOST/api/ce/component?component=$PROJECT_KEY | jq -r '.current.id')
echo $CE_TASK_ID

QUALITY_GATE_STATUS=$(curl -u $SONAR_TOKEN: $SONAR_HOST/api/ce/task?id=$CE_TASK_ID | jq -r '.task.status')
echo $QUALITY_GATE_STATUS

if [ "$QUALITY_GATE_STATUS" = "SUCCESS" ]; then
  echo 'Quality Gate passed'
  exit 0
else
  echo 'Quality Gate failed'
  exit 1
fi
