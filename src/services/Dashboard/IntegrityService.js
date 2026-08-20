import httpClient from "../Base/HttpClient";

export const getSystemIntegrity = async () => {
  const response = await httpClient.get("/api/dashboard/integrity");
  return response.data;
};

export const skipIntegrityCheck = async (entityType, id) => {
  const response = await httpClient.post("/api/dashboard/integrity/skip", {
    entityType,
    id,
  });
  return response.data;
};

export const refundIntegrityActivation = async (entityType, id) => {
  const response = await httpClient.post("/api/dashboard/integrity/refund", {
    entityType,
    id,
  });
  return response.data;
};

export const completeIntegrityActivation = async (entityType, id) => {
  const response = await httpClient.post("/api/dashboard/integrity/complete", {
    entityType,
    id,
  });
  return response.data;
};
