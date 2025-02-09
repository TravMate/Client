import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const API_KEY = GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

export const fetchTourismPlacesApi = async () => {
  console.log(API_KEY);
  try {
    console.log("hi");
    const response = await axios.get(BASE_URL, {
      params: {
        location: "30.0444,31.2357", // Latitude and longitude of Cairo
        // location: "31.2001,29.9187", //Latitude and longitude of Alexandria
        radius: 50000, // Radius in meters (adjust as needed)
        type: "tourist_attraction", // Filter for tourist attractions
        key: API_KEY,
      },
    });
    console.log(response);
    // console.log(response.data.results); // Log the response
    return response.data.results;
  } catch (error) {
    console.log("error");
    console.error("Error fetching data:", error);
  }
};
