const Kafka = require('node-rdkafka');

const consumer = new Kafka.KafkaConsumer({
  'group.id': '${{ values.group_id }}',
  'metadata.broker.list': '${{ values.broker_list }}', // Replace with your Redpanda broker list (e.g., 'redpanda:9092')
});

consumer.connect();

consumer
  .on('ready', function () {
    console.log('Consumer is ready');

    consumer.subscribe(['your-topic']); // Replace with the topic you want to subscribe to

    consumer.consume();
  })
  .on('data', function (data) {
    // Handle incoming messages
    console.log('Received message:', data.value.toString());
  })
  .on('disconnected', function (arg) {
    console.log('Consumer disconnected. ' + JSON.stringify(arg));
  });

// Handle errors
consumer.on('event.error', function (err) {
  console.error('Error: ', err);
});

// Graceful shutdown
process.on('SIGINT', function () {
  console.log('Disconnecting consumer...');
  consumer.disconnect();
});

// Ensure the consumer disconnects on unhandled exceptions
process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception: ', err);
  console.log('Disconnecting consumer...');
  consumer.disconnect();
  process.exit(1);
});
