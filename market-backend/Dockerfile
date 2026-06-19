FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app
COPY market-backend/pom.xml .
COPY market-backend/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=build /app/target/market-backend-0.0.1-SNAPSHOT.jar app.jar
# Copy the data folder so that the CSV dataset is available without external volume mounts
COPY data/ /data/

ENV DATA_FILE_PATH="/data/House Price Dataset.csv"
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
