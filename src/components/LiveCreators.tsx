import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

const CREATORS = [
  { id: "1", name: "Juliana", join: "1200+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana" },
  { id: "2", name: "Steave", join: "1500+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Steave" },
  { id: "3", name: "Joseph", join: "1300+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joseph" },
  { id: "4", name: "Natasha", join: "1700+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha" },
  { id: "5", name: "Chris", join: "1200+", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris" },
];

export function LiveCreators() {
  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="text-lg font-bold text-primary-500">Creators Are Live</Text>
        <View className="bg-red-500 px-2 py-0.5 rounded-md">
          <Text className="text-[10px] font-bold text-white uppercase">• LIVE</Text>
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingLeft: 20 }}
      >
        {CREATORS.map((creator) => (
          <TouchableOpacity key={creator.id} className="items-center mr-6" activeOpacity={0.7}>
            <View className="p-1 rounded-full border-2 border-primary-500 mb-2">
              <Image 
                source={{ uri: creator.avatar }} 
                className="w-16 h-16 rounded-full bg-slate-100"
              />
            </View>
            <Text className="text-xs font-bold text-slate-700">{creator.name}</Text>
            <Text className="text-[10px] text-slate-400">{creator.join} Join</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
