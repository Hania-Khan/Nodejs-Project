# 📬 Notification Service System

A robust and scalable microservice built using Node.js, Express, Kafka, and MongoDB to manage and deliver various types of notifications (Email, SMS, Push) with secure user management using JWT Authentication.

## 🛠️ Pre-requisites

Before running the project, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) & [MySQL](https://www.mysql.com/)

## 📦 Project Setup Guide

Follow the steps below to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Run the App

| Command       | Description                                     |
| ------------- | ----------------------------------------------- |
| `npm start`   | Run the app in production mode                  |
| `npm run dev` | Run the app in development mode using `nodemon` |

### 3. Create .env File

- MONGO_URI=mongodb://<mongo-host>:27017/<database-name>
- APP_PORT=4001
- JWT_SECRET=your_jwt_secret
- KAFKA_TOPIC=Test_Topic
- KAFKA_BROKER=broker:9092

### 4. Build Docker Image for Node App

docker build -t node-app-image-1 .

### 5. Containers Required

- Mongo
- Mongo-Express
- Kafka-UI
- Kafka-broker
- Jenkins-docker
- Jenkins-ssh-agent
- Node-App

## 📁 Project Structure

| Name          | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| `Jenkins/`    | Jenkins pipeline setup and container configuration.                               |
| `Kafka/`      | Kafka setup, including producers, consumers, and related configurations.          |
| `MongoDB/`    | Configuration for running MongoDB container (e.g., `docker-compose`, Dockerfile). |
| `controller/` | Handles incoming HTTP requests and sends appropriate responses.                   |
| `middleware/` | Custom middleware functions for authentication, error handling, etc.              |
| `model/`      | Mongoose models for MongoDB schema definitions.                                   |
| `route/`      | Defines all API endpoints and Express.js routing logic.                           |
| `service/`    | Contains core business logic and reusable integrations (e.g., Email, Push).       |

## 🐳 Docker Setup

All services are configured to run in a `shared-network` so they can communicate seamlessly.

### MongoDB

- **Images**: `mongo`, `mongo-express`
- **MongoDB**:
  - Add credentials via environment variables:
    - `MONGO_INITDB_ROOT_USERNAME`
    - `MONGO_INITDB_ROOT_PASSWORD`
- **Mongo Express**:
  - Port: `8081:8081`
  - Add credentials and `MONGO_URI` as env variables

### Kafka

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

### Jenkins

- **Images**:
  - `jenkins/jenkins` (custom Dockerfile)
  - `jenkins/ssh-agent`
- **Custom Dockerfile**: `Dockerfile.jenkins`
  - Adds Docker CLI & Compose inside Jenkins container
  - User: `root`
- **Ports**:
  - Jenkins: `8080:8080`

### Node App

- **Image Build**:
  ```bash
  docker build -t node-app-image-1 .
  ```

## 🔐 Environment Variable

Set the following environment variables

### .env File

- `MONGO_URI=`
- `APP_PORT=4001`
- `JWT_SECRET=`
- `KAFKA_TOPIC=Test_Topic`
- `KAFKA_BROKER=broker:9092`

## 🧩 Mongoose Models

### Notification Model

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

### User Model

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

## Architecture

### Entity Relationship Diagram

![ERD](./images/ERD-Updated%20ERD.drawio.png)
![ERD](./images/ERD-Page-2.drawio.png)

## 🚀 API Routes

### Notification Routes

| Method | Endpoint                     | Description                            | Request Body                                                                                                                                                                                                    | Example Response (200)                                                                                                                                                                                                                                                                           |
| ------ | ---------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/api/v1/notifications/send` | Create and send a new notification     | `{"type": "email", "recipients": [  { "email": "user3@example.com" }, { "email": "user4@example.com" } ], "subject": Second Test Email", "content": "This is a test email notification.",   "status": "Sent" }` | `{ "message": "Email notification sent successfully", "result": {"type": "email","sender": hania@example.com", "recipients": [{"email": "user3@example.com"},{"email": "user4@example.com"}]"subject": "Second Test Email", "content": "This is a test email notification.","status": "Sent" }}` |
| GET    | `/api/v1/notifications`      | Retrieve all notifications             | N/A                                                                                                                                                                                                             | `[ { "_id": "abc123", "type": "email", "message": "Hello!" } ]`                                                                                                                                                                                                                                  |
| GET    | `/api/v1/notifications/:id`  | Retrieve a specific notification by ID | N/A                                                                                                                                                                                                             | `{ "_id": "abc123", "type": "email", "message": "Hello!" }`                                                                                                                                                                                                                                      |
| PUT    | `/api/v1/notifications/:id`  | Update notification details by ID      | `{ "type": "push", "message": "Updated Message", "recipients": [{"deviceToken": "xyz123"}] }`                                                                                                                   | `{ "message": "Notification updated successfully" }`                                                                                                                                                                                                                                             |
| DELETE | `/api/v1/notifications/:id`  | Delete a specific notification by ID   | N/A                                                                                                                                                                                                             | `{ "message": "Notification deleted successfully" }`                                                                                                                                                                                                                                             |

---

### User Routes

| Method | Endpoint                         | Description                                  | Request Body                                                                                                       | Example Response (200)                                            |
| ------ | -------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| POST   | `/api/v1/users`                  | Create a new user                            | `{ "name": "Hania", "emailaddress": "haniyah@example.com", "password": "password123", "roles": ["email-sender"] }` | `{ "message": "User created successfully" }`                      |
| POST   | `/api/v1/users/login`            | User login                                   | `{ "emailaddress": "haniyah@example.com", "password": "password123" }`                                             | `{ "token": "jwt-token-here" }`                                   |
| GET    | `/api/v1/users/profile`          | Retrieve details of a user                   | N/A                                                                                                                | `{ "_id": "123abc", "name": "Hania", "roles": ["email-sender"] }` |
| GET    | `/api/v1/users/profile/:userId`  | Retrieve details of a user by ID             | N/A                                                                                                                | `{ "_id": "123abc", "name": "Hania", "roles": ["email-sender"] }` |
| PATCH  | `/api/v1/users/update`           | Update specific user fields or roles         | `{ "roles": ["sms-sender"] }`                                                                                      | `{ "message": "User updated successfully" }`                      |
| PUT    | `/api/v1/users/profile/:replace` | Replace an entire user profile with new data | `{ "name": "New Name", "emailaddress": "new@example.com", "password": "newpass", "roles": ["push-sender"] }`       | `{ "message": "User profile replaced successfully" }`             |
| DELETE | `/api/v1/users/delete/:userId`   | Delete a specific user by ID                 | N/A                                                                                                                | `{ "message": "User deleted successfully" }`                      |

## 🛡️ Authentication & Authorization

- **`authenticate` Middleware**: Verifies JWT from the `Authorization` header. Attaches decoded user info to `req.user`. Handles expired or invalid tokens.

- **`roleMiddleware`**: Restricts access based on user roles. Only allows users with specified roles to access protected routes.

- **`validateNotificationRequest`**: Validates incoming notification requests using Joi. Ensures required fields are present based on the notification type (email, sms, push).

## 🐳 Kubernetes

- **`minikube start`**: Initializes and starts the local Kubernetes cluster using Minikube.
- **`minikube dashboard`**: Opens the Minikube Dashboard UI in the browser for visual management.
- **`kubectl port-forward svc/node-app-service 4001:4001`**: Forwards local port `4001` to the `node-app-service` inside the cluster to enable sending API requests from your machine.

---

## 🧪 JMeter Load Testing

- **`Thread Group`**:  
  Configures test load settings like number of threads (virtual users), ramp-up period, and loop count for executing requests.  
  ![Thread Group](./images/Thread%20Group.png)

- **`HTTP Request`**:  
  Defines the API endpoint, HTTP method (`GET`, `POST`, etc.), parameters, and body payload to send during load testing.  
  ![HTTP Request](./images/Http%20Request.png)

- **`HTTP Header Manager`**:  
  Adds headers to the requests, such as `Content-Type: application/json` or `Authorization` tokens to simulate real client behavior.  
  ![HTTP Header Manager](./images/Http%20Header%20Manager.png)

- **`View Results Tree`**:  
  Displays the status, response time, and data returned for each request made during the test run, useful for debugging.  
  ![Results Tree](./images/Results%20Tree.png)

## 📈 Auto-Scaling Observation

- **Pods scaled from 3 to 5**:  
  During the load test, the number of pods increased from 3 to 5, reaching the maximum pod count.  
  This confirms that the Minikube container successfully handled the incoming load and that Horizontal Pod Autoscaling (HPA) is functioning as expected.
  ![Load balancing](./images/loadbalancing.jpeg)
