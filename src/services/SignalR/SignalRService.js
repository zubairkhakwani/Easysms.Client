//SignalR
import * as signalR from "@microsoft/signalr";

//Static
import { Base_Url } from "../../data/Static";

let hubConnection;
let userId;

export const connectSignalR = async (id, addSms, setReconnected) => {
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
      .withUrl(`${Base_Url}/hub`)
      .build();

    await hubConnection.start();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
    await hubConnection.send("RegisterUser", userId);
    addEventListeners(addSms, setReconnected);
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

function addEventListeners(addSms, setReconnected) {
  hubConnection.onclose(async () => {
    await attemptReconnect(setReconnected);
  });

  hubConnection.on("ReceiveSms", (sms) => {
    addSms(sms);
  });
}

async function attemptReconnect(setReconnected) {
  while (hubConnection?.state !== signalR.HubConnectionState.Connected) {
    try {
      await hubConnection.start();
      await hubConnection.send("RegisterUser", userId);
      setReconnected();
      return;
    } catch (ex) {
      console.log(
        `Reconnection failed: ${ex.message}, retrying in 5 seconds...`,
      );

      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
    }
  }
}
