const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
require("dotenv").config();
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
const PORT = Number(process.env.PORT || 5000);
 
const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://10.156.116.176:1883";
const MQTT_USERNAME = process.env.MQTT_USERNAME || "foodsbroker";
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || "Engineering@2024";
const MQTT_TOPIC = process.env.MQTT_TOPIC || "sensor/data";
 
let mqttConnected = false;
let lastMessageAt = null;
let lastRawPayload = null;
 
let latestMachineData = {
  status: "WAITING",
  mqttConnected: false,
  topic: MQTT_TOPIC,
  lastUpdated: null,
  data: {},
};
 
function safeJsonParse(value) {
  if (typeof value !== "string") return value;
 
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
 
function unwrapSingleArray(value) {
  if (Array.isArray(value)) {
    if (value.length === 1) {
      return unwrapSingleArray(value[0]);
    }
 
    return value.map(unwrapSingleArray);
  }
 
  if (value && typeof value === "object") {
    const output = {};
 
    for (const [key, val] of Object.entries(value)) {
      output[key] = unwrapSingleArray(val);
    }
 
    return output;
  }
 
  return value;
}
 
function normalizeDoors(doors) {
  if (!doors) return [];
 
  let parsedDoors = doors;
 
  if (typeof parsedDoors === "string") {
    parsedDoors = safeJsonParse(parsedDoors);
  }
 
  if (!Array.isArray(parsedDoors)) {
    return [];
  }
 
  return parsedDoors
    .map((door) => {
      if (typeof door === "string") {
        return safeJsonParse(door);
      }
 
      return door;
    })
    .filter((door) => door && typeof door === "object");
}
 
function normalizeHighBytePayload(rawPayload) {
  /*
    Accepts either:
 
    {
      topic,
      timestamp,
      data: {
        area,
        machine,
        doors,
        overallStatus
      }
    }
 
    or directly:
 
    {
      area,
      machine,
      doors,
      overallStatus
    }
  */
 
  const unwrapped = unwrapSingleArray(rawPayload);
 
  const sourceData =
    unwrapped && typeof unwrapped === "object" && unwrapped.data
      ? unwrapped.data
      : unwrapped;
 
  if (!sourceData || typeof sourceData !== "object") {
    return {
      status: "WAITING",
      data: {},
    };
  }
 
  const doors = normalizeDoors(sourceData.doors);
 
  const flatTags = {};
 
  let openDoorCount = 0;
  let diagnosticCount = 0;
 
  for (const door of doors) {
    const doorNoRaw = String(Number(door.doorNo));
 
    const guardTag = door.doorTagName || `SFI_Door${doorNoRaw}`;
    const diagnosticTag =
      door.diagnosticTagName || `I_Door${doorNoRaw}Diagnostic`;
 
    const doorValue = door.doorValue === true;
 
    /*
      IMPORTANT:
      Your React App.jsx treats interlockTag as "interlockOk".
      But your HighByte payload uses:
        diagnosticValue true = DIAGNOSTIC
 
      So for the frontend, we invert it:
        diagnosticValue true  -> interlockOk false
        diagnosticValue false -> interlockOk true
    */
    const diagnosticFault = door.diagnosticValue === true;
    const interlockOk = !diagnosticFault;
 
    flatTags[guardTag] = doorValue;
    flatTags[diagnosticTag] = interlockOk;
 
    if (doorValue !== true) openDoorCount++;
    if (diagnosticFault) diagnosticCount++;
  }
 
  let overallStatus = sourceData.overallStatus || "READY";
 
  if (diagnosticCount > 0) {
    overallStatus = "DIAGNOSTIC";
  } else if (openDoorCount > 0) {
    overallStatus = "GUARD OPEN";
  } else {
    overallStatus = "READY";
  }
 
  return {
    status: overallStatus,
    data: {
      _name: sourceData._name,
      _model: sourceData._model,
      _timestamp: sourceData._timestamp,
 
      area: sourceData.area || "Dressings",
      machine: sourceData.machine || "Mespack Filler",
 
      doors,
      overallStatus,
      openDoorCount,
      diagnosticCount,
 
      ...flatTags,
    },
  };
}
 
/* =========================================================
   MQTT SETUP
========================================================= */
 
console.log("Connecting to MQTT broker:", MQTT_BROKER);
console.log("Subscribing topic:", MQTT_TOPIC);
 
const mqttClient = mqtt.connect(MQTT_BROKER, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  reconnectPeriod: 3000,
  connectTimeout: 10000,
  clientId: `mespack_dashboard_backend_${Date.now()}`,
});
 
mqttClient.on("connect", () => {
  mqttConnected = true;
  latestMachineData.mqttConnected = true;
 
  console.log("✅ MQTT connected");
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error("❌ MQTT subscribe error:", err.message);
      return;
    }
 
    console.log("✅ Subscribed to:", MQTT_TOPIC);
  });
});
 
mqttClient.on("reconnect", () => {
  console.log("Reconnecting to MQTT...");
});
 
mqttClient.on("close", () => {
  mqttConnected = false;
  latestMachineData.mqttConnected = false;
  console.log("⚠ MQTT connection closed");
});
 
mqttClient.on("error", (err) => {
  mqttConnected = false;
  latestMachineData.mqttConnected = false;
  console.error("❌ MQTT error:", err.message);
});
 
mqttClient.on("message", (topic, message) => {
  const rawText = message.toString();
 
  lastRawPayload = rawText;
  lastMessageAt = new Date().toISOString();
 
  let parsed;
 
  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("❌ MQTT payload is not valid JSON");
    return;
  }
 
  const normalized = normalizeHighBytePayload(parsed);
 
  latestMachineData = {
    status: normalized.status,
    mqttConnected,
    topic,
    lastUpdated: lastMessageAt,
    data: normalized.data,
  };
 
  console.log("✅ MQTT data updated:", {
    topic,
    status: latestMachineData.status,
    doors: latestMachineData.data.doors?.length || 0,
    openDoorCount: latestMachineData.data.openDoorCount,
    diagnosticCount: latestMachineData.data.diagnosticCount,
  });
});
 
/* =========================================================
   API ROUTES
========================================================= */
 
app.get("/", (req, res) => {
  res.json({
    message: "Mespack Safety Backend is running",
    mqttConnected,
    topic: MQTT_TOPIC,
    lastMessageAt,
  });
});
 
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    mqttConnected,
    topic: MQTT_TOPIC,
    lastMessageAt,
  });
});
 
app.get("/data", (req, res) => {
  res.json(latestMachineData);
});
 
app.get("/raw", (req, res) => {
  res.json({
    mqttConnected,
    topic: MQTT_TOPIC,
    lastMessageAt,
    raw: lastRawPayload,
  });
});
 
/* Optional alias for future extra machines */
app.get("/data-machine2", (req, res) => {
  res.json(latestMachineData);
});
 
/* =========================================================
   START SERVER
========================================================= */
 
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`✅ Dashboard endpoint: http://localhost:${PORT}/data`);
});