FROM java:8
WORKDIR /app
COPY . .
RUN ls
EXPOSE 4000
CMD ["java","-Dspring.conf.location=application.yml","-jar","conversation.management-0.0.1-SNAPSHOT.jar"]
