### client-elite ( Web version )

Elite version of front-end application for the mentor to manage their tasks which include inbox, settings, configurations, reports and automations

Development URL - https://dev-mkelite.byjusorders.com

### client-lite ( Widget version )

Lite version of front-end application for the mentor, which will be incorporated as widget inside the Salesforce. It will have only inbox management - assigment of chats, responds to the chats and initiate the chat.

Development URL - https://dev-mklite.byjusorders.com

Start the application - lite version
```
microservices-mkms/client-lite> yarn
microservices-mkms/client-lite> npm run dev
```

### server

Back-end for both lite and elite versions of application.

Local URL - Request URL: http://localhost:4000/nucleusapi/mkms
Development URL - Request URL: https://dev-nucleus.byjusorders.com/nucleusapi/mkms
Production URL - Request URL: https://nucleus.byjusorders.com/nucleusapi/mkms

Start the server
```
microservices-mkms/server> npm install
microservices-mkms/server> npm run dev
```