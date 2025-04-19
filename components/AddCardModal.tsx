import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from "react-native";
import { CreditCard } from "lucide-react-native";
import { colors } from "../theme/colors";
import { Card, CardType } from "./CardChip";

interface AddCardModalProps {
  visible: boolean;
  onAddCard: (card: Card) => void;
  onClose: () => void;
}

// Popular cards by country
const popularCards = {
  USA: [
    "Chase Sapphire",
    "American Express Gold",
    "Capital One Venture",
    "Citi Double Cash",
    "Discover it",
    "Bank of America Cash Rewards",
    "Wells Fargo Active Cash",
  ],
  Canada: [
    "TD Cash Back Visa",
    "BMO CashBack Mastercard",
    "Scotiabank Momentum Visa",
    "CIBC Dividend Visa",
    "RBC Cash Back Mastercard",
    "Tangerine Money-Back",
  ],
  Mexico: ["Santander Free", "BBVA Bancomer Azul", "Citibanamex Teletón", "Banorte Visa Clásica", "HSBC Classic"],
};

// Available countries
const countries = ["United States", "Canada", "Mexico"];

export const AddCardModal: React.FC<AddCardModalProps> = ({ visible, onAddCard, onClose }) => {
  const [country, setCountry] = useState("United States");
  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCardName, setCustomCardName] = useState("");

  // Get cards for selected country
  const getCardsForCountry = () => {
    if (country === "United States") return popularCards.USA;
    if (country === "Canada") return popularCards.Canada;
    if (country === "Mexico") return popularCards.Mexico;
    return [];
  };

  const handleAddCard = () => {
    const selectedCard = showCustomInput ? customCardName : cardName;
    if (!selectedCard) return;
    
    onAddCard({
      id: Date.now().toString(),
      name: selectedCard,
      type: cardType,
      lastFour: "0000", // Default last four digits
      color: colors.anime.purple // Default color
    });
    
    // Reset state
    setCardName("");
    setCustomCardName("");
    setShowCustomInput(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Payment Card</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {/* Country Selection */}
            <Text style={styles.label}>Country</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>{country}</Text>
              <Text style={styles.selectArrow}>▼</Text>
            </View>
            
            {/* Card Selection */}
            <View style={styles.cardSection}>
              <Text style={styles.label}>Card</Text>
              <TouchableOpacity onPress={() => setShowCustomInput(true)}>
                <Text style={styles.addCustomText}>Add custom card</Text>
              </TouchableOpacity>
            </View>
            
            {showCustomInput ? (
              <TextInput
                style={styles.input}
                value={customCardName}
                onChangeText={setCustomCardName}
                placeholder="Enter card name"
              />
            ) : (
              <View style={styles.cardGrid}>
                {getCardsForCountry().map((card, index) => (
                  <TouchableOpacity
                    key={card}
                    style={[
                      styles.cardOption,
                      cardName === card && styles.selectedCardOption,
                      index % 2 === 0 ? { marginRight: 8 } : {}
                    ]}
                    onPress={() => setCardName(card)}
                  >
                    <Text style={styles.cardOptionText}>{card}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Card Type */}
            <Text style={styles.label}>Card Type</Text>
            <View style={styles.cardTypeContainer}>
              <TouchableOpacity 
                style={styles.radioContainer}
                onPress={() => setCardType("credit")}
              >
                <View style={styles.radioOuter}>
                  {cardType === "credit" && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Credit Card</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioContainer}
                onPress={() => setCardType("debit")}
              >
                <View style={styles.radioOuter}>
                  {cardType === "debit" && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Debit Card</Text>
              </TouchableOpacity>
            </View>
            
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
                <CreditCard size={20} color="white" />
                <Text style={styles.addButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#333',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  selectArrow: {
    fontSize: 12,
    color: '#666',
  },
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCustomText: {
    color: colors.anime.purple,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  cardOption: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedCardOption: {
    borderColor: colors.anime.purple,
    backgroundColor: `${colors.anime.purple}10`,
  },
  cardOptionText: {
    fontSize: 14,
    color: '#333',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.anime.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.anime.purple,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.anime.purple,
    borderRadius: 8,
    padding: 16,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
