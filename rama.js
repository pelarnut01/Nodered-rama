import {
  InfluxDB,
  Point,
  HttpError,
  consoleLogger,
} from "@influxdata/influxdb-client";
import { url, token, org, bucket } from "./env.mjs";
import { hostname } from "node:os";
import mqtt from "mqtt";

function writeDBcouter(
  deviceName,
  cpu_load,
  isum,
  l1,
  l2,
  l3,
  psum,
  esum,
  econsum
) {
  // write point with a custom timestamp
 
  const point = new Point(deviceName)
    .tag("Device", deviceName)
    .floatField("cpu_load", cpu_load)
    .floatField("I_SUM", isum)
    .floatField("P_L1", l1)
    .floatField("P_L2", l2)
    .floatField("P_L3", l3)
    .floatField("P_SUM", psum)
    .floatField("E_SUM", esum)
    .floatField("E_CONSU_SUM", econsum);

  const writeApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, "ns");
  // setup default tags for all writes through this API
  writeApi.useDefaultTags({ location: hostname() });

  writeApi.writePoint(point);

  writeApi
    .close()
    .then(() => {
    //   console.log("FINISHED");
    })
    .catch((e) => {
      console.error(e);
      console.log("Finished ERROR");
    });

 
}

const MQTT_SERVER = "18.143.83.11";
const MQTT_PORT = "1883";
const MQTT_USER = "";
const MQTT_PASSWORD = "";

// Connect MQTT
var client = mqtt.connect({
  host: MQTT_SERVER,
  port: MQTT_PORT,
  username: MQTT_USER,
  password: MQTT_PASSWORD,
});

client.subscribe("dit/rama/mdb1", function (err) {
  if (err) {
    console.log(err);
  }
});
client.subscribe("dit/rama/mdb2", function (err) {
  if (err) {
    console.log(err);
  }
});
client.subscribe("dit/rama/mdb3", function (err) {
  if (err) {
    console.log(err);
  }
});
client.subscribe("dit/rama/mdb4", function (err) {
  if (err) {
    console.log(err);
  }
});
client.subscribe("dit/rama/mdb5", function (err) {
  if (err) {
    console.log(err);
  }
});

client.on("message", function (topic, message) {
  try {
    console.log("TOPIC", topic);

    var data = JSON.parse(message.toString());
    // console.log("MESSAGE", data);
    writeDBcouter(
      data.deviceName,
      data.cpu_load,
      data.I_SUM,
      data.P_L1,
      data.P_L2,
      data.P_L3,
      data.P_SUM,
      data.E_SUM,
      data.E_CONSU_SUM
    );
   
  } catch (ex) {
    console.log(ex);
  } finally {
    //perform this code regardless
  }
 
});
