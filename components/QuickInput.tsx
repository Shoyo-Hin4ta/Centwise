import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { Mic } from "lucide-react-native";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { colors } from "../theme/colors";

import type { Card } from "./CardChip";

interface QuickInputProps {
  selectedCard?: Card | null;
  onTransaction?: (transaction: { description: string; amount: number; card: Card | null }) => void;
}

export function QuickInput({ selectedCard, onTransaction }: QuickInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Parse the input to extract amount
      const amountMatch = inputValue.match(/\$?(\d+(\.\d+)?)/);
      const amount = amountMatch ? Number.parseFloat(amountMatch[1]) : 0;

      if (onTransaction) {
        onTransaction({
          description: inputValue,
          amount,
          card: selectedCard,
        });
      } else {
        console.log("Transaction submitted:", inputValue, "Card:", selectedCard);
      }

      setInputValue("");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("coffee $4.50");
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter transaction like 'coffee $4.50'"
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.recording]}
          onPress={toggleRecording}
        >
          <Mic size={16} color={isRecording ? colors.anime.pink : colors.anime.purple} />
        </TouchableOpacity>
      </View>
      <Button onPress={handleSubmit} style={styles.addButton}>
        Add
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    paddingRight: 40,
    backgroundColor: colors.white,
    borderColor: colors.anime.lavender,
  },
  micButton: {
    position: "absolute",
    right: 4,
    top: 4,
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  recording: {
    opacity: 0.7,
  },
  addButton: {
    backgroundColor: colors.anime.purple,
  },
});
