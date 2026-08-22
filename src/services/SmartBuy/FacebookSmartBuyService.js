import httpClient from "../Base/HttpClient";

export const getFacebookSmartBuyCountries = async () => {
  const response = await httpClient.get("/api/facebook-smart-buy/countries");
  return response.data;
};

export const getFacebookSmartBuyRecommendations = async (countryKey) => {
  const response = await httpClient.get(
    `/api/facebook-smart-buy/recommendations?countryKey=${encodeURIComponent(countryKey)}`,
  );
  return response.data;
};

export const purchaseFacebookSmartBuyOption = async (optionId) => {
  const response = await httpClient.post("/api/facebook-smart-buy/purchase", {
    optionId,
  });
  return response.data;
};
