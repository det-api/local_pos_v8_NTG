import mongoose from "mongoose";
import config from "config";
import mqtt from "mqtt";

const dbConnect = async () => {
  const dbUrl = config.get<string>("dbUrl");

  try {
    console.log(dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to DB");
    process.exit(1);
  }
};

export const sub_topic = "detpos/device/";
const mqttUrl = config.get<string>("mqttUrl");
const mqttUserName = config.get<string>("mqttUserName");
const mqttPassword = config.get<string>("mqttPassword");

export const client = mqtt.connect(mqttUrl, {
  username: mqttUserName,
  password: mqttPassword,
});

export const connect = () => {
  client.subscribe("#", { qos: 0 }, function (err) {
    if (err) {
      console.log("An error occurred while subscribing");
    } else {
      console.log("Subscribed successfully to " + sub_topic.toString());
    }
  });
};

export default dbConnect;
