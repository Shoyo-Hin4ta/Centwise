import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Coffee, Bus, Film, Book, HelpCircle, ShoppingCart, Home } from "lucide-react-native";
import { Category } from "../modules/expenses/types";
import { colors } from "../theme/colors";

interface ChangeCategoryModalProps {
  visible: boolean;
  categories: Category[];
  currentCategoryId: string;
  onSelect: (categoryId: string) => void;
  onClose: () => void;
}

export const ChangeCategoryModal: React.FC<ChangeCategoryModalProps> = ({
  visible,
  categories,
  currentCategoryId,
  onSelect,
  onClose,
}) => {
  // Function to get the appropriate icon based on category type
  const getCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case "food":
        return <Coffee size={20} color="white" />;
      case "transport":
        return <Bus size={20} color="white" />;
      case "entertainment":
        return <Film size={20} color="white" />;
      case "shopping":
        return <ShoppingCart size={20} color="white" />;
      case "coffee":
        return <Coffee size={20} color="white" />;
      case "home":
        return <Home size={20} color="white" />;
      default:
        return <HelpCircle size={20} color="white" />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Move to Different Category</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  item.id === currentCategoryId && styles.selectedCategoryItem
                ]}
                onPress={() => onSelect(item.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  {getCategoryIcon(item.iconType)}
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    backgroundColor: `${colors.anime.purple}20`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.anime.purple,
    fontSize: 16,
    fontWeight: '600',
  },
});
