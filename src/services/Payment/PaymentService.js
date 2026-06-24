import httpClient from "../Base/HttpClient";

export const getCryptoPaymentConfig = async () => {
  const response = await httpClient.get("/api/payments/crypto/config");
  return response.data;
};

export const createCryptoInvoice = async ({ amount }) => {
  const response = await httpClient.post(
    "/api/payments/crypto/invoice",
    {
      amount,
      returnOrigin: window.location.origin,
    },
    {
      validateStatus: (status) => status < 500,
    },
  );
  return response.data;
};

export const getCryptoPaymentStatus = async ({ orderId }) => {
  const response = await httpClient.get("/api/payments/crypto/status", {
    params: { orderId },
  });
  return response.data;
};
