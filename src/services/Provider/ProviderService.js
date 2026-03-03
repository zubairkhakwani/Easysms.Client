import httpClient from "../Base/HttpClient";

export const getProviders = async () => {
  const response = await httpClient.get("/providers");
  return response.data.data;
};

export const getServices = async (providerId) => {
  const response = await httpClient.get(`/providers/${providerId}/services`);
  return response.data.data;
};

export const getCountries = async (providerId) => {
  const response = await httpClient.get(`/providers/${providerId}/countries`);
  return response.data.data;
};

export const getOperators_Pricings = async (
  providerId,
  serviceId,
  countryId,
) => {
  const response = await httpClient.get(
    `/providers/${providerId}/services/${serviceId}/countries/${countryId}/current-prices`,
  );
  return response.data.data;
};
