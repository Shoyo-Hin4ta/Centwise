import React from "react";
import { View, StyleSheet } from "react-native";
import { TransactionsScreen } from "../screens/TransactionsScreen";
import { Header } from "../components/Header";

export default function TransactionsRoute() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <TransactionsScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
