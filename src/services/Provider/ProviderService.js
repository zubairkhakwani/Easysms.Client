import httpClient from "../Base/HttpClient";

export const getProviders = async () => {
  const response = await httpClient.get("/api/providers");
  return response.data.data;
};

export const getProvidersInfo = async () => {
  const response = await httpClient.get("/api/providers/info");
  return response.data.data;
};

export const getPhysicalProviderInfo = async () => {
  const response = await httpClient.get(`/api/providers/physical-info`);
  return response.data.data;
};

export const getServices = async (providerId) => {
  const response = await httpClient.get(
    `/api/providers/${providerId}/services`,
  );
  return response.data.data;
};

export const getCountries = async (providerId) => {
  const response = await httpClient.get(
    `/api/providers/${providerId}/countries`,
  );
  return response.data.data;
};

export const getCountriesMetaData = async (providerId, serviceId) => {
  const response = await httpClient.get(
    `/api/providers/${providerId}/services/${serviceId}/countries`,
  );
  return response.data.data;
};

export const getOperators_Pricings = async (
  providerId,
  serviceId,
  countryId,
) => {
  const response = await httpClient.get(
    `/api/providers/${providerId}/services/${serviceId}/countries/${countryId}/current-prices`,
  );
  return response.data.data;
};

export const requestNumber = async (
  providerId,
  serviceId,
  countryId,
  payload,
) => {
  const response = await httpClient.post(
    `/api/providers/${providerId}/services/${serviceId}/countries/${countryId}/request-number`,
    payload,
  );
  return response.data;
};
