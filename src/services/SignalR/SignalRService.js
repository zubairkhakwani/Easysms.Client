//SignalR
import * as signalR from "@microsoft/signalr";

//Static
import { Base_Url } from "../../data/Static";

//Services
import TokenService from "../../services/Token/TokenService";

let hubConnection;

export const connectSignalR = async ({
  addSms,
  addMail,
  setReconnected,
  OnNewNumbers,
  OnRemoveNumber,
}) => {
  try {
    // Disconnect from the previous connection if connected and we have the hubConnection
    if (
      hubConnection?.state === signalR.HubConnectionState.Connected &&
      hubConnection
    ) {
      await disconnectAsync();
    }

    hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${Base_Url}/hub`, {
        accessTokenFactory: () => TokenService.getToken(),
      })
      .build();

    await hubConnection.start();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
    await hubConnection.send("RegisterUser");
    addEventListeners(
      addSms,
      addMail,
      setReconnected,
      OnNewNumbers,
      OnRemoveNumber,
    );
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

function addEventListeners(
  addSms,
  addMail,
  setReconnected,
  OnNewNumbers,
  OnRemoveNumber,
) {
  if (setReconnected) {
    hubConnection.onclose(async () => {
      await attemptReconnect(setReconnected);
    });
  }

  if (addSms) {
    hubConnection.on("ReceiveSms", (sms) => {
      addSms(sms);
    });
  }

  if (addMail) {
    hubConnection.on("ReceiveMail", (mail) => {
      addMail(mail);
    });
  }
  if (OnNewNumbers) {
    hubConnection.on("NumberAdded", (newNumber) => {
      OnNewNumbers(newNumber);
    });
  }

  if (OnRemoveNumber) {
    hubConnection.on("NumberRemoved", (id) => {
      OnRemoveNumber(id);
    });
  }
}

async function attemptReconnect(setReconnected) {
  while (hubConnection?.state !== signalR.HubConnectionState.Connected) {
    try {
      await hubConnection.start();
      await hubConnection.send("RegisterUser");
      if (setReconnected) {
        setReconnected();
      }

      return;
    } catch (ex) {
      console.log(
        `Reconnection failed: ${ex.message}, retrying in 5 seconds...`,
      );

      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
    }
  }
}
