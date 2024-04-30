import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import userStoriesData from "../userStoriesData";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

const STORY_VIEW_DURATION = 5 * 1000;

export default function UserStories() {
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  const progress = useSharedValue(0);

  const currentUser = userStoriesData[userIndex];
  const currentStory = currentUser.stories[storyIndex];

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: STORY_VIEW_DURATION,
      easing: Easing.linear,
    });
  }, [storyIndex, userIndex]);

  const goToNextUser = () => {
    setUserIndex((prevIndex) =>
      prevIndex === userStoriesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousUser = () => {
    setUserIndex((prevIndex) =>
      prevIndex === 0 ? userStoriesData.length - 1 : prevIndex - 1
    );
  };

  const goToPreviousStory = () => {
    setStoryIndex((index) => {
      if (index === 0) {
        goToPreviousUser();
        return userStoriesData[userIndex -1 ].stories.length - 1;
      } else {
        return index - 1;
      }
    });
  };

  const goToNextStory = () => {
    setStoryIndex((index) => {
      if (index === userStoriesData.length - 1) {
        goToNextUser();
        return 0;
      } else {
        return index + 1;
      }
    });
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  useAnimatedReaction(
    () => progress.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue === 1) {
        runOnJS(goToNextStory)();
      }
    }
  );

  return (
    <>
      <View style={styles.storyContainer}>
        <Image source={{ uri: currentStory.uri }} style={styles.image} />

        <Pressable style={styles.navPressable} onPress={goToPreviousStory} />
        <Pressable
          style={[styles.navPressable, { right: 0 }]}
          onPress={goToNextStory}
        />

        <View style={styles.header}>
          <LinearGradient
            // Background Linear Gradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.indicatorRow}>
            {currentUser.stories.map((_, index) => (
              <View
                style={styles.indicatorBG}
                key={`${currentUser.userId}-${index}`}
              >
                <Animated.View
                  style={[
                    styles.indicator,
                    index === storyIndex && indicatorAnimatedStyle,
                    index > storyIndex && { width: 0 },
                    index < storyIndex && { width: "100%" },
                  ]}
                />
              </View>
            ))}
          </View>

          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Send message"
          placeholderTextColor="white"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  header: {
    position: "absolute",
    top: 0,
    // backgroundColor: "rgba(0,0,0,0.25)",
    width: "100%",
    padding: 20,
    paddingTop: 5,
  },
  username: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "black",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 15,
    borderRadius: 50,
  },
  navPressable: {
    position: "absolute",
    width: "30%",
    height: "100%",
  },
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
