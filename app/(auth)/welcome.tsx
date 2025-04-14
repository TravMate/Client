import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import CustomButton from "@/components/CustomButton";
import { images, onboarding } from "@/constants";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastIndex = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <View className="flex flex-row justify-between items-center w-full">
        <View className="flex flex-row items-center px-5 gap-2">
          <Image source={images.logo} className="w-[40px] h-[40px]" />
          <Image
            source={images.travmate}
            className="w-[80px] h-[80px]"
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/sign_up");
          }}
          className="pr-5"
        >
          <Text className="text-black text-md font-JakartaBold">skip</Text>
        </TouchableOpacity>
      </View>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[6px] h-[6px] mx-1 bg-[#d1d4d9] rounded-full" />
        }
        activeDot={
          <View className="w-[30px] h-[6px] mx-1 bg-[#F98C53] rounded-full" />
        }
        onIndexChanged={(index) => {
          setActiveIndex(index);
        }}
      >
        {onboarding.map((item) => (
          <View key={item.id} className={"flex justify-center items-center"}>
            <Image
              source={item.image}
              className={"w-full h-[300px]"}
              resizeMode={"contain"}
            />
            <View
              className={
                "flex flex-row items-center justify-center w-full mt-10"
              }
            >
              <Text
                className={
                  "text-[#023E8A] text-3xl font-bold mx-10 text-center"
                }
              >
                {item.title}
              </Text>
            </View>
            <Text
              className={
                "text-lg text-center font-JakartaSemiBold text-[#000000CC] mx-7 mt-3"
              }
            >
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastIndex ? "Get Started" : "Next"}
        handlePress={() =>
          isLastIndex
            ? router.replace("/(auth)/sign_up")
            : swiperRef.current?.scrollBy(1)
        }
        containerStyles={
          "w-11/12 mt-10 mb-8 bg-[#F98C53] rounded-xl min-h-[62px]"
        }
        textStyles="text-[#023E8A]"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
