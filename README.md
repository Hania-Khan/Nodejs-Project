
---

##  Docker Setup

All services are configured to run in a `shared-network` so they can communicate seamlessly.

---

### 🔹 MongoDB

- **Images**: `mongo`, `mongo-express`
- **MongoDB**:
  - Add credentials via environment variables:
    - `MONGO_INITDB_ROOT_USERNAME`
    - `MONGO_INITDB_ROOT_PASSWORD`
- **Mongo Express**:
  - Port: `8081:8081`
  - Add credentials and `MONGO_URI` as env variables

---

### 🔹 Kafka

- **Images**: `apache/kafka`, `provectuslabs/kafka-ui`
- **Apache Kafka**:
  - Port: `9092:9092`
  - Env Variables:
    - `KAFKA_ADVERTISED_LISTENERS`
    - `KAFKA_NUM_PARTITIONS`
    - `KAFKA_MESSAGE_MAX_BYTES`
- **Kafka UI**:
  - Port: `8090:8080`
  - Env:
    - `DYNAMIC_CONFIG_ENABLED=true` (Allows access without login)
  - **Config**:
    - Add `kui/config.yaml` with:
      - `cluster name`
      - `broker path & port`
    - Mount `config.yaml` as volume

---

### 🔹 Jenkins

- **Images**:
  - `jenkins/jenkins` (custom Dockerfile)
  - `jenkins/ssh-agent`
- **Custom Dockerfile**: `Dockerfile.jenkins`
  - Adds Docker CLI & Compose inside Jenkins container
  - User: `root`
- **Ports**:
  - Jenkins: `8080:8080`

---

### 🔹 Node App

- **Image Build**:
  ```bash
  docker build -t node-app-image-1 .
