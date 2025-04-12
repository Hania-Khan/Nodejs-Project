const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["broker:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "Test_Topic", fromBeginning: true }); // ✅ Exact topic name

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Consumed message from topic ${topic}:`, value);

      // You can add your DB saving or business logic here
    },
  });

  console.log("Kafka consumer running...");
};

module.exports = startConsumer;
