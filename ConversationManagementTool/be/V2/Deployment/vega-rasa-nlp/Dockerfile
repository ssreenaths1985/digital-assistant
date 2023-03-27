FROM rasa/rasa:1.10.0-full

USER root
WORKDIR /app
COPY . /app/
WORKDIR ./bot
RUN  rasa train -c ./config.yml -d ./domain.yml --data ./data --debug 
EXPOSE 5005
CMD [ "run","--enable-api","--cors","*","--debug"]
