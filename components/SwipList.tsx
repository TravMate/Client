import { View, useWindowDimensions } from "react-native";
import React from "react";
import Carousel from "leon-react-native-snap-carousel";
import { Place } from "@/types/type";
import BigPlaceCard from "./BigPlaceCard";

interface SwipListProps {
  data: Place[];
}

const SwipList = ({ data }: SwipListProps) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View className="w-full flex-1 justify-center items-center">
      <Carousel
        data={data}
        renderItem={({ item, index }: { item: Place; index: number }) => (
          <BigPlaceCard item={item} index={index} />
        )}
        width={windowWidth}
        loop
        sliderWidth={windowWidth}
        itemWidth={windowWidth * 0.8}
        inactiveSlideOpacity={0.6}
      />
    </View>
  );
};

export default SwipList;
