FROM rasa/rasa:1.7.0-full as trainer
COPY ./vanilla /app

FROM rasa/rasa:1.7.0-full
COPY --from=trainer /app .
EXPOSE 5005
CMD ["run", "--enable-api"]