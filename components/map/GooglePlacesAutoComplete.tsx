import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACES_BASE_URL = "https://places.googleapis.com/v1/places:autocomplete";

interface Props {
  onPressPlace: (place: PlacePrediction) => void;
  center: {
    latitude: number;
    longitude: number;
  };
}
export const GooglePlacesAutoComplete: FC<Props> = ({
  onPressPlace,
  center,
}) => {
  const [text, setText] = useState("");
  const {
    data,
    isPending,
    mutateAsync: onSearch,
    reset,
  } = useMutation({
    mutationFn: getGooglePlaces,
  });

  const debouncedFetch = _.debounce(onSearch, 500);

  function onChangeText(val: string) {
    setText(val);
    if (val.trim().length > 2) {
      debouncedFetch({
        searchText: val,
        center,
      });
    }
    if (val.trim().length === 0) {
      reset();
    }
  }

  function handleOnPressPlace(pl: PlacePrediction) {
    setText("");
    reset();
    onPressPlace(pl);
  }

  function renderPlaces() {
    if (data) {
      return (
        <FlatList
          style={styles.content}
          data={data.suggestions}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => handleOnPressPlace(item.placePrediction)}
              >
                <Text>
                  {item.placePrediction.structuredFormat.mainText.text}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      );
    }
    return null;
  }

  return (
    <>
      <TextInput
        value={text}
        style={styles.input}
        placeholder="Search Place"
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />
      {renderPlaces()}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  content: {
    padding: 10,
    backgroundColor: "#ccc",
    position: "absolute",
    borderRadius: 7,
    top: 45,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  placeItem: {
    padding: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
});

// request

interface PlacesParams {
  searchText: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius?: number;
}

async function getGooglePlaces(params: PlacesParams) {
  try {
    const response = await axios.post<PlacesAutoCompleteResponse>(
      PLACES_BASE_URL,
      {
        input: params.searchText,
        locationBias: {
          circle: {
            center: params.center,
            radius: params.radius || 15000,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "*",
          // "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types,suggestions.placePrediction.distanceMeters",
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {}
}

// @types

export interface PlacesAutoCompleteResponse {
  suggestions: Suggestion[];
}

export interface Suggestion {
  placePrediction: PlacePrediction;
}

export interface PlacePrediction {
  place: string;
  placeId: string;
  text: MainText;
  structuredFormat: StructuredFormat;
  types: string[];
}

export interface StructuredFormat {
  mainText: MainText;
  secondaryText: SecondaryText;
}

export interface MainText {
  text: string;
  matches: Match[];
}

export interface Match {
  endOffset: number;
}

export interface SecondaryText {
  text: string;
}
