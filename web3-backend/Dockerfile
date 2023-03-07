FROM openjdk:17
VOLUME /tmp
EXPOSE 8080
ENV MONGO_DATABASE="game-api-db"
ENV MONGO_USER="MM802"
ENV MONGO_PASSWORD="zv5381peU8QOGYao"
ENV MONGO_CLUSTER="cluster0.i050q0e.mongodb.net"
ARG JAR_FILE=target/games-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]



RUN echo "The ARG variable is $MONGO_DATABASE$"