import * as signalR from "@microsoft/signalr";
import { Await } from "react-router-dom";

let hubConnection;
let userId;

export const connectSignalR = async (id, addSms) => {
  try {
    userId = id;

    // Disconnect from the previous connection if connected and we have the hubConnection
    if (
      hubConnection?.state === signalR.HubConnectionState.Connected &&
      hubConnection
    ) {
      await disconnectAsync();
    }

    hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7265/hub")
      .build();

    addEventListeners(addSms);
    await hubConnection.start();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
    await hubConnection.send("RegisterUser", userId);
  } catch (err) {
    console.log("Connection failed:", err);
  }
};

async function disconnectAsync() {
  if (!hubConnection) return;
  try {
    await hubConnection.stop();
  } catch (err) {
    console.log(err);
  }

  hubConnection = null;
}

function addEventListeners(addSms) {
  hubConnection.onclose(async () => {
    await attemptReconnect();
  });

  hubConnection.on("ReceiveSms", (sms) => {
    addSms(sms);
  });
}

async function attemptReconnect() {
  while (hubConnection?.state !== "Connected") {
    try {
      await hubConnection.start();
      await hubConnection.send("RegisterUser", userId);
      return;
    } catch (ex) {
      console.log(
        `Reconnection failed: ${ex.message}, retrying in 5 seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
    }
  }
}
