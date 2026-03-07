import * as signalR from "@microsoft/signalr";

let connection;
let userId;

export const connectSignalR = async (id, addSms) => {
  try {
    userId = id;

    if (connection) {
      await disconnectAsync();
    }
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7265/hub")
      .withAutomaticReconnect()
      .build();

    addEventListeners(addSms);

    await connection.start();
    await connection.send("RegisterUser", userId);
  } catch (err) {
    console.error("Connection failed:", err);
  }
};

async function disconnectAsync() {
  if (!connection) return;

  console.log("Disconnecting previous connection manually.");
  try {
    await connection.stop();
  } catch (err) {
    console.error(err);
  }

  connection = null;
}

function addEventListeners(addSms) {
  connection.onreconnected(async () => {
    if (userId) {
      await connection.send("RegisterUser", userId);
    }
  });

  // Handle ReceiveSms messages from the hub
  connection.on("ReceiveSms", (sms) => {
    console.log("SMS received:", sms);
    addSms(sms);
  });
}
