import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const GOOGLE_PLACES_API =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

// Function to fetch autocomplete suggestions
const fetchPlaces = async ({ queryKey }) => {
  const [_key, input] = queryKey;
  if (!input) return []; // Avoid unnecessary calls when input is empty

  const params = {
    input,
    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY, // Replace with your Google API key
  };

  const { data } = await axios.get(GOOGLE_PLACES_API, { params });
  return data.predictions;
};

const GooglePlacesAutocomplete = () => {
  const [inputValue, setInputValue] = useState("");

  // Configure useQuery to fetch when we call refetch explicitly
  const { data, error, isLoading, refetch } = useQuery(
    ["places", inputValue],
    fetchPlaces,
    {
      enabled: false, // disabled by default; will trigger manually
    }
  );

  // Debounce user input to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue) {
        refetch();
      }
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, refetch]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search places"
        value={inputValue}
        onChangeText={setInputValue}
      />

      {isLoading && <Text style={styles.statusText}>Loading...</Text>}
      {error && <Text style={styles.statusText}>Error: {error.message}</Text>}

      <FlatList
        data={data || []}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>{item.description}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 50 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  statusText: {
    marginVertical: 10,
    textAlign: "center",
  },
  itemText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default GooglePlacesAutocomplete;
