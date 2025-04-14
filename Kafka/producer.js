const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-node-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  console.log("✅ Producer connected");

  const message = {
    topic: "test-topic",
    messages: [{ key: "key1", value: "Hello Kafka from Node.js!" }],
  };

  await producer.send(message);
  console.log("📤 Message sent:", message.messages);
};

module.exports = { runProducer };
