const { Kafka } = require("kafkajs");

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["broker:9092"], // This matches your Docker setup
});

// Create producer
const producer = kafka.producer();

// Function to produce message
const produceMessage = async (message) => {
  await producer.connect();

  await producer.send({
    topic: "Test_Topic", // ✅ Your Kafka topic name from UI
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log("Message sent to topic Test_Topic:", message);

  await producer.disconnect();
};

module.exports = produceMessage;
