## 🚀 Project Setup Guide

Follow the steps below to set up and run the project locally:

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Create .env File

MONGO_URI=mongodb://<mongo-host>:27017/<database-name>
APP_PORT=4001
JWT_SECRET=your_jwt_secret
KAFKA_TOPIC=Test_Topic
KAFKA_BROKER=broker:9092

### 3. Build Docker Image for Node App

docker build -t node-app-image-1 .

### 4. Run Required Containers

Mongo
Mongo-Express
Kafka-UI
Kafka-broker
Jenkins-docker
Jenkins-ssh-agent
Node-App

---

## Docker Setup

## All services are configured to run in a `shared-network` so they can communicate seamlessly.

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

## 🚀 API Routes

### 📩 Notification Routes

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| POST   | `/api/v1/notifications/send` | Create and send a new notification     |
| GET    | `/api/v1/notifications`      | Retrieve all notifications             |
| GET    | `/api/v1/notifications/:id`  | Retrieve a specific notification by ID |
| PUT    | `/api/v1/notifications/:id`  | Update notification details by ID      |
| DELETE | `/api/v1/notifications/:id`  | Delete a specific notification by ID   |

---

### 👤 User Routes

| Method | Endpoint                         | Description                                  |
| ------ | -------------------------------- | -------------------------------------------- |
| POST   | `/api/v1/users`                  | Create a new user                            |
| POST   | `/api/v1/users/login`            | User login                                   |
| GET    | `/api/v1/users/profile`          | Retrieve details of all users                |
| GET    | `/api/v1/users/profile/:userId`  | Retrieve details of a specific user by ID    |
| PATCH  | `/api/v1/users/update`           | Update specific user fields or roles         |
| PUT    | `/api/v1/users/profile/:replace` | Replace an entire user profile with new data |
| DELETE | `/api/v1/users/delete/:userId`   | Delete a specific user by ID                 |
