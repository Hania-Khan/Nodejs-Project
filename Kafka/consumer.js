const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-node-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const runConsumer = async () => {
  await consumer.connect();
  console.log("✅ Consumer connected");
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📥 Received message: ${message.value.toString()}`);
    },
  });
};

module.exports = { runConsumer };
