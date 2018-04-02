#!/bin/bash
if [ "$1" = "prod" ]; 
then 
	echo "DEPLOYING ON PROD"
	ng build --prod
	gcloud compute scp dist/* instance-1:/home/mohak/chatbot-ui-staging/

	echo "================================================="
	echo "RUN THESE COMMANDS ON SERVER AFTER SUCCESSFUL SSH"
	echo "================================================="
	echo "sudo rm /var/www/nginx/*"
	echo "sudo mv /home/mohak/chatbot-ui-staging/* /var/www/nginx/"
	echo "sudo service nginx restart"
	echo "================================================="

	gcloud compute ssh instance-1
else
	echo "DEPLOYING ON TEST"
	ng build
	sudo rm -rf /var/www/html/*
	sudo mv dist/* /var/www/html/
fi
