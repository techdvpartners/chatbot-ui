ng build --prod
gcloud compute scp dist/* instance-1:/home/mohak/chatbot-ui-staging/

echo "RUN THESE ON SERVER"
echo "==================="
echo "sudo rm /var/www/nginx/*"
echo "sudo mv /home/mohak/chatbot-ui-staging/* /var/www/nginx/"
echo "sudo service nginx restart"
echo "==================="

gcloud compute ssh instance-1
