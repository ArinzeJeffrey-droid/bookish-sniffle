import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, View, Button, Image } from "react-native";
import UserStories from "./components/UserStories";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import userStoriesData from "./userStoriesData";

const pages = ["#e1f3fa", "#308d46"];
const allStories = userStoriesData.flatMap((user) => user.stories);
const width = 200;

const AnimatedPage = ({ pageColor, pageIndex, index, children }) => {
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { perspective: 300 },
      {
        rotateY: `${interpolate(
          pageIndex.value,
          [index - 1, index, index + 1],
          [90, 0, -90]
        )}deg`,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          zIndex: 100 - index,
          aspectRatio: 9 / 16,
          position: "absolute",
          backgroundColor: pageColor,
          backfaceVisibility: "hidden",
          borderRadius: 10,
          transformOrigin: ["50%", "50%", -width / 2],
          overflow: "hidden",
        },
        animatedStyles,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default function App() {
  const pageIndex = useSharedValue(0);

  const runAnimation = () => {
    pageIndex.value = withTiming(Math.floor(pageIndex.value + 1), {
      duration: 300,
    });
  };

  const goBack = () => {
    pageIndex.value = withTiming(Math.floor(pageIndex.value - 1), {
      duration: 300,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserStories />

      {/* {allStories.map((story, index) => (
        <AnimatedPage
          key={index}
          index={index}
          pageColor={"black"}
          pageIndex={pageIndex}
        >
          <Image
            source={{ uri: story.uri }}
            style={{ width: "100%", height: "100%" }}
          />
        </AnimatedPage>
      ))} */}

      {/* <View style={{ position: "absolute", bottom: 50 }}>
        <Button title="Next" onPress={runAnimation} />
        <Button title="Prev" onPress={goBack} />
      </View> */}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
