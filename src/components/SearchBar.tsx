import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search courses..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <View className="flex-row items-center bg-white rounded-[24px] border border-slate-50 px-5 h-16 mb-6 shadow-sm">
      <Text className="text-primary-500 mr-4 text-xl font-bold">🔍</Text>
      <TextInput
        className="flex-1 text-base text-slate-800 py-2 font-medium"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => setQuery("")}
          className="bg-slate-50 w-7 h-7 rounded-full items-center justify-center"
          hitSlop={10}
        >
          <Text className="text-slate-400 text-[10px] font-black">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Documentation: Controlled search input component integrated with useDebounce to minimize render cycles.
