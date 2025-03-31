import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

import { colors } from "../../theme/colors";

interface InputProps extends TextInputProps {
  className?: string;
}

export function Input({ className, style, ...props }: InputProps) {
  return (
    <TextInput style={[styles.input, style]} placeholderTextColor={colors.gray[400]} {...props} />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.gray[900],
  },
});
