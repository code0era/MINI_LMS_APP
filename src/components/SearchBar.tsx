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
    <View className="flex-row items-center bg-surface-card rounded-xl border border-surface-border px-3 h-12 mb-4">
      <Text className="text-text-secondary mr-2">🔍</Text>
      <TextInput
        className="flex-1 text-base text-text-primary py-2"
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => setQuery("")}
          className="p-1"
          hitSlop={10}
        >
          <Text className="text-surface-muted font-bold">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Documentation: Controlled search input component integrated with useDebounce to minimize render cycles.
