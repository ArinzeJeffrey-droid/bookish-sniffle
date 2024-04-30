import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const StoryIndicator = ({ currentIndex, totalItems, progress }) => {
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress * 100}%`,
  }));

  return (
    <View style={styles.indicatorRow}>
      {[...Array(totalItems).keys()].map((index) => (
        <View style={styles.indicatorBG} key={index}>
          <Animated.View
            style={[
              styles.indicator,
              index === currentIndex && indicatorAnimatedStyle,
              index > currentIndex && { width: 0 },
              index < currentIndex && { width: "100%" },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorRow: {
    gap: 5,
    flexDirection: "row",
    marginBottom: 20,
  },
  indicatorBG: {
    flex: 1,
    height: 3,
    backgroundColor: "gray",
    borderRadius: 10,
    overflow: "hidden",
  },
  indicator: {
    backgroundColor: "white",
    height: "100%",
  },
});

export default StoryIndicator;
