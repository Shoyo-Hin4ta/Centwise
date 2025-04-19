import React from "react";
import { View, StyleSheet } from "react-native";
import { TransactionDetailScreen } from "../../screens/TransactionDetailScreen";
import { Header } from "../../components/Header";
import { BottomNav } from "../../components/BottomNav";

export default function TransactionDetailRoute() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <TransactionDetailScreen />
      </View>
      <BottomNav />
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
