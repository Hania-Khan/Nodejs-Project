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
  ```

## Environment Variable

Set the following environment variables

---

### 🔹 .env File

MONGO_URI=

- `APP_PORT=4001`
- `JWT_SECRET=`
- `KAFKA_TOPIC=Test_Topic`
- `KAFKA_BROKER=broker:9092`

---

## Mongoose Models

### 🔸 Notification Model

This model stores information related to different types of notifications such as Email, SMS, and Push.

#### Fields

- `type` (String): Type of notification - can be `email`, `sms`, or `push`.
- `content` (String): The message content of the notification.
- `recipients` (Object - Nested Schema):
  - `email` (String): Email address (for email type).
  - `deviceToken` (String): Device token (for push type).
  - `phoneNumber` (String): Phone number (for SMS type).
- `subject` (String): Subject of the notification (only for email type).
- `title` (String): Title of the notification (only for push type).
- `status` (String): Current status of the notification - `Sent`, `Failed`, or `Pending`.
- `timestamps` (Boolean): Automatically adds `createdAt` and `updatedAt` timestamps.

#### Indexing

- `type`
- `status`

---

### 🔸 User Model

This model stores details of users who can send notifications, along with their assigned roles.

#### Fields

- `name` (String): Full name of the user.
- `emailaddress` (String): Unique email address used for authentication.
- `password` (String): Hashed password.
- `roles` (Array of Strings): Roles assigned to the user. Possible values:
  - `email-sender`
  - `sms-sender`
  - `push-sender`
- `timestamps` (Boolean): Automatically includes `createdAt` and `updatedAt`.

#### Indexing

- `emailaddress`
