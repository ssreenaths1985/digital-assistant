VEGA ASSISTANT

Vega assistant has 8 services under three groups

Management console
Management Console backend (Spring boot application)

https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/vega-console-server

Compiler (nodejs application) - Used to let user modify code in console itself.
https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/compiler

Sandbox bot
nlp-service
https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/sandbox-nlp-server

action-service
https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/sandbox-action-server

Management console is used to create dataset and test the accuracy of the dataset before training the assistant with it.  The compiler service is used to compile the code the user writes while adding new intents with custom actions. The sandbox bot with its nlp-service and action-service is used to test the model.

Vega Bot
nlp-service
https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/vega-nlp-server

action-service
https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/vega-action-server

redis

This is the vega digital assistant with nlp-service and action-service. Redis is used to store the conversation logs

Router
https://git.idc.tarento.com/nxt/thor/thor-assistant/-/tree/varsha/ConversationManagementTool/be/V2/Deployment/router

Router routes the requests to specific bots based on the domain names.

Frontend

The front end for the management console is a react application that will be deployed as a container and a domain will be created for that. 

The front end for vega digital assistant will be a part of Karmayogi Bharat mobile application.
