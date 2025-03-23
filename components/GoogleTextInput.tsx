import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";

import { Place } from "@/types/type";
import { useGoogleAutoComplete } from "@/hooks/useAutoComplete";
import { TripPlace } from "@/store/planTripStore";

const PlaceSearchComponent = ({ onPlaceSelect }: { onPlaceSelect: any }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<TripPlace | null>(null);

  // Debounce function to prevent too many API calls
  const [debouncedInput, setDebouncedInput] = useState("");

  // Set up debounce for input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // React Query hook
  const {
    data: suggestions,
    isLoading,
    isError,
    error
  } = useGoogleAutoComplete(debouncedInput, debouncedInput);

  const handleSelectPlace = (place: TripPlace) => {
    setSelectedPlace(place);
    onPlaceSelect(place);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a place..."
        value={searchInput}
        onChangeText={setSearchInput}
        autoCapitalize="none"
      />

      {/* Show loading indicator */}
      {isLoading && debouncedInput.length > 1 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Searching places...</Text>
        </View>
      )}

      {/* Show error if any */}
      {isError && (
        <Text style={styles.errorText}>
          Error:{" "}
          {error instanceof Error
            ? error.message
            : "Failed to fetch suggestions"}
        </Text>
      )}

      {/* Show results only when we have input and results */}
      {debouncedInput.length > 1 &&
        suggestions &&
        suggestions.length > 0 &&
        !selectedPlace && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Text style={styles.suggestionName}>{item.name}</Text>
                  <Text style={styles.suggestionDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.suggestionType}>{item.primaryType}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

      {/* Show selected place if any */}
      {selectedPlace && (
        <View style={styles.selectedPlaceContainer}>
          <Text style={styles.selectedPlaceTitle}>Selected Place</Text>
          <Text style={styles.selectedPlaceName}>{selectedPlace.name}</Text>
          <Text style={styles.selectedPlaceDescription}>
            {selectedPlace.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666"
  },
  errorText: {
    color: "red",
    marginBottom: 16
  },
  suggestionsContainer: {
    position: "absolute",
    minHeight: 200,
    backgroundColor: "white"
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: "500"
  },
  suggestionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4
  },
  suggestionType: {
    fontSize: 12,
    color: "#999",
    marginTop: 2
  },
  selectedPlaceContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8
  },
  selectedPlaceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8
  },
  selectedPlaceName: {
    fontSize: 18,
    fontWeight: "500"
  },
  selectedPlaceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4
  }
});

export default PlaceSearchComponent;
