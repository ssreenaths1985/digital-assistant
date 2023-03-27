FROM rasa/rasa-sdk:1.10.0

USER root

COPY . /app/

RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir -p /usr/share/man/man1
RUN apt-get update -y && apt-get install -y  default-jre

WORKDIR /app/bot/
USER 1001
EXPOSE 5055
ENTRYPOINT []
CMD ./actions/start_actions.sh
