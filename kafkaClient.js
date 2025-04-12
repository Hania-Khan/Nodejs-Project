// kafkaClient.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-node-app",
  brokers: ["broker:9092"], // internal Docker hostname
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-group" });

module.exports = { kafka, producer, consumer };
