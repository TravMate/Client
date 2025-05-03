import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

var { width } = Dimensions.get("window");

const ScreenLoadingSkeleton = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Trending Section */}
      <View style={styles.section}>
        <ShimmerPlaceHolder
          style={[styles.sectionTitle, { marginLeft: 15 }]}
          LinearGradient={LinearGradient}
        />
        <View style={styles.movieRow}>
          <ShimmerPlaceHolder
            style={styles.semimovieCardLeft}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            style={styles.movieCardPrimary}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            style={styles.semimovieCardRight}
            LinearGradient={LinearGradient}
          />
        </View>
      </View>

      {/* Top Rated Section */}
      <View style={styles.topRatedSection}>
        <ShimmerPlaceHolder
          style={styles.sectionTitle}
          LinearGradient={LinearGradient}
        />
        <View style={styles.movieRow}>
          <View style={{ alignItems: "center" }}>
            <ShimmerPlaceHolder
              style={styles.movieCard}
              LinearGradient={LinearGradient}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <ShimmerPlaceHolder
              style={styles.movieCard}
              LinearGradient={LinearGradient}
            />
          </View>
        </View>
      </View>

      <View style={styles.topRatedSection}>
        <ShimmerPlaceHolder
          style={styles.sectionTitle}
          LinearGradient={LinearGradient}
        />
        <View style={styles.movieRow}>
          <View style={{ alignItems: "center" }}>
            <ShimmerPlaceHolder
              style={styles.movieCard}
              LinearGradient={LinearGradient}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <ShimmerPlaceHolder
              style={styles.movieCard}
              LinearGradient={LinearGradient}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  section: {
    marginBottom: 30,
    marginTop: 20,
  },
  topRatedSection: {
    marginBottom: 40,
    marginTop: 20,
    paddingLeft: 15,
  },
  sectionTitle: {
    width: 130,
    height: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  movieRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  movieCard: {
    width: width * 0.43,
    height: 185,
    borderRadius: 25,
  },
  semimovieCardLeft: {
    width: 30,
    height: 200,
    borderRadius: 25,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  semimovieCardRight: {
    width: 30,
    height: 200,
    borderRadius: 25,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  semiTopRatedMovieCardRight: {
    width: width * 0.1,
    height: 180,
    borderRadius: 25,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  movieCardPrimary: {
    width: width * 0.75,
    height: 220,
    borderRadius: 25,
  },
  movieTitle: {
    width: width * 0.3,
    height: 13,
    marginTop: 10,
    borderRadius: 8,
  },
  semiMovieTitle: {
    width: width * 0.17,
    height: 13,
    marginTop: 10,
    borderStartEndRadius: 8,
    borderStartStartRadius: 8,
  },
});

export default ScreenLoadingSkeleton;
