version: '2'

 services:
   rocketchat:
     image: rocket.chat:latest
     command: >
       bash -c
         "for i in `seq 1 30`; do
           node main.js &&
           s=$$? && break || s=$$?;
           echo \"Tried $$i times. Waiting 5 secs...\";
           sleep 5;
         done; (exit $$s)"
     restart: unless-stopped
     volumes:
       - ./uploads:/app/uploads
     environment:
       - PORT=3000
       - ROOT_URL=http://rnd-mentor-konnect.byjuslabs.com
       - MONGO_URL=mongodb+srv://admin:5XS35CJ11OqfEwjO@cluster0.fynrx.mongodb.net/rocketchat?retryWrites=true&w=majority
       - MONGO_OPLOG_URL=mongodb+srv://admin:5XS35CJ11OqfEwjO@cluster0.fynrx.mongodb.net/local?retryWrites=true&w=majority
     ports:
       - 80:3000
