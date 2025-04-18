import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Switch, TouchableOpacity, Modal } from "react-native";
import { Link, useRouter } from "expo-router";
import { Calendar as CalendarPicker } from "react-native-calendars";

// Lucide React Native icons
import { ArrowLeft, Calendar as CalendarIcon, Filter, PieChart as PieChartIcon } from "lucide-react-native";

// Components
import { Header } from "../../components/Header";
import { BottomNav } from "../../components/BottomNav";
import { Button } from "../../components/ui/Button";

// Theme
import { colors } from "../../theme/colors";

// Module imports - Store, Hooks, Types
import { useExpensesStore } from "../../modules/expenses/store"; // Import store
import { useExpenseCategories } from "../../modules/expenses";
import { TimeFrame, Transaction, Category, SummaryCategory } from "../../modules/expenses/types"; // Import types

// Create PieChart component
import PieChartComponent from "./PieChart";

// Payment method color mapping (Keep for now, could be moved later)
const paymentMethodColors: Record<string, string> = {
  Cash: "#4CAF50",
  "Chase Sapphire": "#1e4a86",
  "Bank of America": "#e31837",
  "Amex Gold": "#f8d57e",
};

// Removed local allTransactions definition - Data now comes from the store

export default function Dashboard() {
  const router = useRouter();
  
  // --- State ---
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [showByPayment, setShowByPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SummaryCategory | null>(null); // Store selected category object
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]); // For transaction list view
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<'main' | 'paymentMethod' | 'transactions'>('main');
  
  // Date Picker State
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customRangeActive, setCustomRangeActive] = useState(false);

  // --- Store Selectors ---
  const getAllTransactions = useExpensesStore((state) => state.getAllTransactions);
  const getCategoryById = useExpensesStore((state) => state.getCategoryById);
  const storeCategories = useExpensesStore((state) => state.categories); // Get base category definitions

  // --- Data Fetching Hook ---
  // Pass startDate and endDate if customRangeActive is true
  const { 
    categories: summaryCategories, // Renamed to avoid conflict with storeCategories
    totalAmount, 
    isLoading 
  } = useExpenseCategories(
    timeFrame, 
    customRangeActive ? startDate : null, 
    customRangeActive ? endDate : null
  );

  // --- Date Handling Functions ---
  interface CalendarDay {
    year: number;
    month: number;
    day: number;
    timestamp: number;
    dateString: string;
  }
  
  const handleDayPress = (day: CalendarDay) => {
    console.log("Day selected:", day);
    
    // Create date using direct date components to avoid timezone issues
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    console.log("Created selectedDate:", selectedDate);
    
    // Apply timezone offset correction
    const correctedDate = new Date(selectedDate.getTime());
    console.log("Final corrected date:", correctedDate);
    
    if (!startDate || (startDate && endDate)) { // Start new selection or reset
      setStartDate(correctedDate);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: { selected: true, color: colors.anime.purple }
      });
      setCustomRangeActive(true); // Single day is also custom
      setTimeFrame("custom");
      // Don't close calendar on first click
    } else { // Second selection (end date)
      if (correctedDate.getTime() < startDate.getTime()) { // Selected date before start date
        // Treat as new single date selection
        setStartDate(correctedDate);
        setEndDate(null);
        setMarkedDates({
          [day.dateString]: { selected: true, color: colors.anime.purple }
        });
      } else { // Valid end date
        setEndDate(correctedDate);
        // Create range marking
        const markedDatesObj: any = {};
        let currentDate = new Date(startDate);
        while (currentDate <= correctedDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          markedDatesObj[dateStr] = { 
            color: colors.anime.lavender,
            startingDay: currentDate.getTime() === startDate.getTime(),
            endingDay: currentDate.getTime() === correctedDate.getTime(),
            textColor: 'white' // Ensure text is visible
          };
          if (markedDatesObj[dateStr].startingDay || markedDatesObj[dateStr].endingDay) {
            markedDatesObj[dateStr].color = colors.anime.purple; // Start/end color
          }
          // Increment by full day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setMarkedDates(markedDatesObj);
      }
      setCustomRangeActive(true);
      setTimeFrame("custom");
      setShowCalendar(false); // Close calendar after range selection
    }
  };
  
  // Format date for display, forcing UTC to prevent timezone shifts
  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    // Use UTC methods to format the date correctly
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
    const day = date.getUTCDate().toString().padStart(2, '0');
    // Simple formatting, adjust as needed (e.g., using a library)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getUTCMonth()]} ${day}, ${year}`;
  };

  // Get display text for date selection
  const getDateDisplayText = (): string => {
    if (customRangeActive && startDate) {
      if (endDate && startDate.getTime() !== endDate.getTime()) {
        return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
      } else {
        return formatDisplayDate(startDate); // Single date
      }
    }
    // Default timeframe text
    return timeFrame === "week" ? "Last 7 days" 
         : timeFrame === "month" ? "This month" 
         : timeFrame === "year" ? "This year"
         : "Select Date";
  };

  // Format date/time for transaction list
  const formatDate = (date: Date) => { // Accept Date object
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const formatTime = (date: Date) => { // Accept Date object
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // --- Data Calculation/Filtering Functions (using Store data) ---

  // Generate payment method summary data for pie chart, filtered by current timeframe/dates
  const getPaymentMethodData = useMemo(() => {
    if (!showByPayment) return []; // Only calculate if needed

    const transactions = getAllTransactions(); // Get all transactions from store
    const now = new Date();
    let filterStartDate: Date | null = null;
    let filterEndDate: Date | null = null;

    // Determine date range based on current view (timeFrame or custom dates)
    if (customRangeActive) {
      filterStartDate = startDate;
      filterEndDate = endDate ?? startDate; // Use start date if end date is null (single day)
    } else {
      if (timeFrame === "week") {
        filterEndDate = new Date(now);
        filterStartDate = new Date(now);
        filterStartDate.setDate(now.getDate() - 7);
      } else if (timeFrame === "month") {
        filterEndDate = new Date(now);
        filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else { // year
        filterEndDate = new Date(now);
        filterStartDate = new Date(now.getFullYear(), 0, 1);
      }
    }

    // Set time boundaries
    if (filterStartDate) filterStartDate.setHours(0, 0, 0, 0);
    if (filterEndDate) filterEndDate.setHours(23, 59, 59, 999);

    // Filter transactions from the store
    const filtered = transactions.filter(t => {
       const tDate = new Date(t.date);
       if (customRangeActive && filterStartDate && !endDate) { // Single custom date UTC compare
          const targetDate = new Date(filterStartDate);
          return tDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
                 tDate.getUTCMonth() === targetDate.getUTCMonth() &&
                 tDate.getUTCDate() === targetDate.getUTCDate();
       }
       if (filterStartDate && filterEndDate) { // Date range compare
          return tDate >= filterStartDate && tDate <= filterEndDate;
       }
       return false;
    });
    
    const filteredTotalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);
    if (filteredTotalAmount === 0) return [];

    const paymentTotals: Record<string, number> = {};
    filtered.forEach((transaction) => {
      if (!paymentTotals[transaction.paymentMethod]) {
        paymentTotals[transaction.paymentMethod] = 0;
      }
      paymentTotals[transaction.paymentMethod] += transaction.amount;
    });
    
    // Convert to array format needed for the pie chart
    return Object.entries(paymentTotals).map(([name, value], index) => ({
      id: `payment-${index}`, // Generate a unique ID
      name,
      amount: value,
      percentage: Math.round((value / filteredTotalAmount) * 100), 
      color: paymentMethodColors[name] || "#9e9e9e", // Use defined color or fallback
      iconType: "other", // Default icon type for payment methods
    }));
  }, [showByPayment, timeFrame, startDate, endDate, customRangeActive, getAllTransactions]);
  
  // Generate category data for a specific payment method (used in paymentMethod view level)
  const getCategoryDataForPaymentMethod = useMemo(() => {
    if (!selectedPaymentMethod) return [];
    
    const allTrans = getAllTransactions(); // Get all transactions from store
    
    // Filter transactions for the selected payment method AND current timeframe/dates
     const now = new Date();
    let filterStartDate: Date | null = null;
    let filterEndDate: Date | null = null;
     if (customRangeActive) {
      filterStartDate = startDate;
      filterEndDate = endDate ?? startDate; 
    } else { /* ... determine range based on timeFrame ... */ 
       if (timeFrame === "week") { filterEndDate = new Date(now); filterStartDate = new Date(now); filterStartDate.setDate(now.getDate() - 7); } 
       else if (timeFrame === "month") { filterEndDate = new Date(now); filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1); } 
       else { filterEndDate = new Date(now); filterStartDate = new Date(now.getFullYear(), 0, 1); }
    }
    if (filterStartDate) filterStartDate.setHours(0, 0, 0, 0);
    if (filterEndDate) filterEndDate.setHours(23, 59, 59, 999);

    const paymentMethodTransactions = allTrans.filter(t => {
       const tDate = new Date(t.date);
       let dateMatch = false;
       if (customRangeActive && filterStartDate && !endDate) { // Single custom date UTC compare
          const targetDate = new Date(filterStartDate);
          dateMatch = tDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
                      tDate.getUTCMonth() === targetDate.getUTCMonth() &&
                      tDate.getUTCDate() === targetDate.getUTCDate();
       } else if (filterStartDate && filterEndDate) { // Date range compare
          dateMatch = tDate >= filterStartDate && tDate <= filterEndDate;
       }
       return t.paymentMethod === selectedPaymentMethod && dateMatch;
    });
    
    const methodTotal = paymentMethodTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (methodTotal === 0) return [];

    const categoryTotals: Record<string, { amount: number, id: string }> = {};
    paymentMethodTransactions.forEach((transaction) => {
      const category = getCategoryById(transaction.categoryId); // Get category details
      if (category) {
         if (!categoryTotals[category.name]) { // Group by name
           categoryTotals[category.name] = { amount: 0, id: transaction.categoryId };
         }
         categoryTotals[category.name].amount += transaction.amount;
      }
    });
    
    // Convert to array format needed for the pie chart
    return Object.entries(categoryTotals).map(([name, data]) => {
      const categoryInfo = getCategoryById(data.id); // Get full category info
      return {
        id: data.id,
        name,
        amount: data.amount,
        percentage: Math.round((data.amount / methodTotal) * 100),
        color: categoryInfo?.color || "#9e9e9e", // Use color from store
        iconType: categoryInfo?.iconType || "other", // Use iconType from store
      };
    });
  }, [selectedPaymentMethod, timeFrame, startDate, endDate, customRangeActive, getAllTransactions, getCategoryById]);

  // --- Event Handlers ---

  // Handle segment click in pie chart
  const handleSegmentClick = (segment: { id: string; name: string }) => {
    const allTrans = getAllTransactions();
    
    // For debugging
    console.log("Selected date check:");
    console.log("startDate raw:", startDate);
    if (startDate) {
      console.log("startDate components:", 
        startDate.getFullYear(), 
        startDate.getMonth()+1, 
        startDate.getDate()
      );
    }
    
    // Step 1: Filter by category or payment method
    let categoryOrPaymentFiltered: Transaction[] = [];
    
    if (viewLevel === 'main') {
      if (showByPayment) {
        categoryOrPaymentFiltered = allTrans.filter(t => t.paymentMethod === segment.name);
      } else {
        categoryOrPaymentFiltered = allTrans.filter(t => t.categoryId === segment.id);
      }
    } else if (viewLevel === 'paymentMethod') {
      categoryOrPaymentFiltered = allTrans.filter(t => 
        t.categoryId === segment.id && t.paymentMethod === selectedPaymentMethod
      );
    }
    
    // Step 2: Apply date filtering with direct component comparison
    const dateFilteredTransactions = categoryOrPaymentFiltered.filter(t => {
      const tDate = new Date(t.date);
      
      // Direct component comparison to avoid timezone issues
      const tYear = tDate.getFullYear();
      const tMonth = tDate.getMonth();
      const tDay = tDate.getDate();
      
      console.log(`Transaction date components: ${tYear}-${tMonth+1}-${tDay}`);
      
      // For custom date range or single date
      if (customRangeActive && startDate) {
        // For single date
        if (!endDate || (endDate && startDate.getTime() === endDate.getTime())) {
          const sYear = startDate.getFullYear();
          const sMonth = startDate.getMonth();
          const sDay = startDate.getDate();
          
          console.log(`Selected: ${sYear}-${sMonth+1}-${sDay}`);
          
          // Simple component-wise comparison
          return tYear === sYear && tMonth === sMonth && tDay === sDay;
        }
        
        // For date range
        if (endDate) {
          const sYear = startDate.getFullYear();
          const sMonth = startDate.getMonth();
          const sDay = startDate.getDate();
          
          const eYear = endDate.getFullYear();
          const eMonth = endDate.getMonth();
          const eDay = endDate.getDate();
          
          // Create dates for comparison using only year, month, day
          const transactionDateOnly = new Date(tYear, tMonth, tDay, 0, 0, 0, 0);
          const startDateOnly = new Date(sYear, sMonth, sDay, 0, 0, 0, 0);
          const endDateOnly = new Date(eYear, eMonth, eDay, 23, 59, 59, 999);
          
          return transactionDateOnly >= startDateOnly && transactionDateOnly <= endDateOnly;
        }
      } else {
        // Standard timeframes (week, month, year)
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth();
        const nowDay = now.getDate();

        // Initialize these variables with default values
        let startYear = nowYear;
        let startMonth = nowMonth;
        let startDay = nowDay;

        if (timeFrame === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          startYear = weekAgo.getFullYear();
          startMonth = weekAgo.getMonth();
          startDay = weekAgo.getDate();
        } else if (timeFrame === "month") {
          startYear = nowYear;
          startMonth = nowMonth;
          startDay = 1;
        } else if (timeFrame === "year") {
          startYear = nowYear;
          startMonth = 0;
          startDay = 1;
        }
        
        // Create dates for comparison
        const transactionDateOnly = new Date(tYear, tMonth, tDay, 0, 0, 0, 0);
        const startDateOnly = new Date(startYear, startMonth, startDay, 0, 0, 0, 0);
        const endDateOnly = new Date(nowYear, nowMonth, nowDay, 23, 59, 59, 999);
        
        return transactionDateOnly >= startDateOnly && transactionDateOnly <= endDateOnly;
      }
      
      return false;
    });
    
    console.log("Filtered transactions count:", dateFilteredTransactions.length);
    
    // Step 3: Update UI
    if (viewLevel === 'main') {
      if (showByPayment) {
        setSelectedPaymentMethod(segment.name);
        setViewLevel('paymentMethod');
        setSelectedCategory(null);
      } else {
        const categoryInfo = summaryCategories.find(c => c.id === segment.id);
        setSelectedCategory(categoryInfo || null);
        setViewLevel('transactions');
        setSelectedPaymentMethod(null);
        setFilteredTransactions(dateFilteredTransactions);
      }
    } else if (viewLevel === 'paymentMethod') {
      const categoryInfo = getCategoryDataForPaymentMethod.find(c => c.id === segment.id);
      setSelectedCategory(categoryInfo || null);
      setViewLevel('transactions');
      setFilteredTransactions(dateFilteredTransactions);
    }
  };

  // Handle back button press
  const handleBack = () => {
    if (viewLevel === 'transactions') {
      // If coming from payment method breakdown, go back there
      if (selectedPaymentMethod) {
        setViewLevel('paymentMethod');
        setSelectedCategory(null); // Clear selected category
      } else { // Otherwise, go back to main view
        setViewLevel('main');
        setSelectedCategory(null);
      }
    } else if (viewLevel === 'paymentMethod') {
      // Go back to main view from payment method breakdown
      setViewLevel('main');
      setSelectedPaymentMethod(null); // Clear selected payment method
    }
    // Clear filtered transactions when going back
    setFilteredTransactions([]); 
  };

  // --- Display Logic ---

  // Get title based on current view level and selections
  const getTitle = () => {
    if (viewLevel === 'transactions' && selectedCategory) {
      return selectedPaymentMethod 
        ? `${selectedCategory.name} via ${selectedPaymentMethod}` 
        : `${selectedCategory.name} Transactions`;
    } else if (viewLevel === 'paymentMethod' && selectedPaymentMethod) {
      return `${selectedPaymentMethod} Breakdown`;
    }
    // Default title based on timeframe/custom range
    return customRangeActive ? "Custom Range Spending" :
           timeFrame === "week" ? "This Week's Spending" :
           timeFrame === "month" ? "This Month's Spending" :
           timeFrame === "year" ? "This Year's Spending" : 
           "Spending Summary";
  };

  // Determine data for the main pie chart (either categories or payment methods)
  const pieChartData = useMemo(() => {
    return showByPayment ? getPaymentMethodData : summaryCategories;
  }, [showByPayment, getPaymentMethodData, summaryCategories]);

  // Determine data for the category list on the left
  const listData = useMemo(() => {
     if (viewLevel === 'paymentMethod') {
        return getCategoryDataForPaymentMethod;
     }
     return showByPayment ? getPaymentMethodData : summaryCategories;
  }, [viewLevel, showByPayment, getPaymentMethodData, summaryCategories, getCategoryDataForPaymentMethod]);


  // --- Render ---
  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-4 pt-2 pb-4">
        {/* Title and Back Button */}
        <View className="flex-row items-center my-2">
          {viewLevel !== 'main' && (
            <TouchableOpacity onPress={handleBack} className="mr-2">
              <ArrowLeft size={24} color={colors.anime.purple} />
            </TouchableOpacity>
          )}
          {/* Use getTitle() for dynamic title */}
          <Text className="text-2xl font-bold" style={{ color: colors.anime.purple }}>{getTitle()}</Text>
        </View>

        {/* Date selection */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Date Selector Button */}
          <TouchableOpacity 
            onPress={() => setShowCalendar(true)}
            className="flex-row items-center bg-gray-100 rounded-full px-4 py-2"
          >
            <CalendarIcon size={16} color={colors.gray[500]} className="mr-2" />
            <Text className="text-gray-600 text-sm">
              {getDateDisplayText()}
            </Text>
          </TouchableOpacity>
          
          {/* Timeframe Buttons (only show in main view) */}
          {viewLevel === 'main' && (
            <View className="flex-row">
              <Pressable 
                onPress={() => { setTimeFrame("week"); setCustomRangeActive(false); setStartDate(null); setEndDate(null); setMarkedDates({}); }} 
                className={`px-3 py-1 rounded-l-full ${timeFrame === 'week' && !customRangeActive ? 'bg-anime-purple' : 'bg-gray-200'}`}
              >
                <Text className={timeFrame === 'week' && !customRangeActive ? 'text-white' : 'text-gray-600'}>Week</Text>
              </Pressable>
              <Pressable 
                onPress={() => { setTimeFrame("month"); setCustomRangeActive(false); setStartDate(null); setEndDate(null); setMarkedDates({}); }} 
                className={`px-3 py-1 ${timeFrame === 'month' && !customRangeActive ? 'bg-anime-purple' : 'bg-gray-200'}`}
              >
                <Text className={timeFrame === 'month' && !customRangeActive ? 'text-white' : 'text-gray-600'}>Month</Text>
              </Pressable>
              <Pressable 
                onPress={() => { setTimeFrame("year"); setCustomRangeActive(false); setStartDate(null); setEndDate(null); setMarkedDates({}); }} 
                className={`px-3 py-1 rounded-r-full ${timeFrame === 'year' && !customRangeActive ? 'bg-anime-purple' : 'bg-gray-200'}`}
              >
                <Text className={timeFrame === 'year' && !customRangeActive ? 'text-white' : 'text-gray-600'}>Year</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Subtitle (e.g., Spending Summary) - Removed as title is now dynamic */}
        {/* <Text className="text-gray-600 text-sm mb-4">{getTitle()}</Text> */}

        {/* Calendar Modal */}
        <Modal visible={showCalendar} transparent={true} animationType="slide">
          <View className="flex-1 justify-center bg-black/50">
            <View className="bg-white mx-4 rounded-xl overflow-hidden">
              <CalendarPicker
                markingType={'period'}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                // maxDate={new Date().toISOString().split('T')[0]} // Allow future dates for testing if needed
                theme={{
                  selectedDayBackgroundColor: colors.anime.purple,
                  todayTextColor: colors.anime.purple,
                  arrowColor: colors.anime.purple,
                  'stylesheet.calendar.header': { // Style month/year header
                     monthText: { color: colors.anime.purple, fontWeight: 'bold' },
                     yearText: { color: colors.anime.purple, fontWeight: 'bold' },
                  }
                }}
              />
              <TouchableOpacity 
                onPress={() => setShowCalendar(false)}
                className="p-4 items-center border-t border-gray-200" // Added border
              >
                <Text className="text-anime-purple font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Main Content Area (Conditional Rendering) */}
        {viewLevel === 'transactions' ? (
          // Transaction List View
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const category = getCategoryById(transaction.categoryId); // Get category details
                return (
                  <View 
                    key={transaction.id}
                    className="flex-row justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-3"
                  >
                    <View className="flex-row items-center">
                      {/* Use category icon/color if available */}
                      <View 
                         className="h-10 w-10 rounded-full items-center justify-center mr-3"
                         style={{ backgroundColor: category?.color || colors.gray[200] }} // Use category color
                      >
                        {/* Can add specific icons later based on category.iconType */}
                        <PieChartIcon size={20} color={colors.white} /> 
                      </View>
                      <View>
                        <Text className="font-medium text-base">{transaction.description}</Text>
                        <Text className="text-xs text-gray-500">
                          {formatDate(new Date(transaction.date))} · {formatTime(new Date(transaction.date))}
                        </Text>
                        <Text className="text-xs text-gray-500">{transaction.paymentMethod}</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-base text-gray-800">
                      -${transaction.amount.toFixed(2)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View className="flex-1 items-center justify-center p-8 bg-gray-50 rounded-lg">
                <Text className="text-gray-500">No transactions found for this selection.</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          // Pie Chart Views (Main or Payment Method Breakdown)
          <View className="flex-1">
            <View className="flex-row flex-1">
              {/* Left column - Categories/Payment Methods list */}
              <View className="w-2/5 bg-gray-50 rounded-lg p-4 mr-2">
                <Text className="text-sm font-medium mb-3">
                  {viewLevel === 'paymentMethod' ? `Categories in ${selectedPaymentMethod}` : (showByPayment ? "Payment Methods" : "Categories")}
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {listData.map((item, index) => ( // Use dynamic listData
                    <View key={index} className="flex-row items-center mb-3">
                      <View 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className="text-sm">{item.name}</Text>
                      {/* Optionally show amount/percentage */}
                      {/* <Text className="text-xs text-gray-500 ml-auto">${item.amount.toFixed(2)} ({item.percentage}%)</Text> */}
                    </View>
                  ))}
                   {listData.length === 0 && !isLoading && (
                     <Text className="text-xs text-gray-400 text-center mt-4">No data for this period.</Text>
                   )}
                </ScrollView>
              </View>
              
              {/* Right column - Pie chart */}
              <View className="flex-1 items-center justify-center">
                {isLoading ? (
                  <Text>Loading...</Text>
                ) : (
                  <View className="items-center">
                    <PieChartComponent 
                      // Pass correct data based on view level
                      data={viewLevel === 'paymentMethod' ? getCategoryDataForPaymentMethod : pieChartData}
                      onSegmentClick={handleSegmentClick}
                      totalAmount={viewLevel === 'paymentMethod' ? getCategoryDataForPaymentMethod.reduce((sum, i) => sum + i.amount, 0) : totalAmount}
                    />
                    
                    {/* Show Payment Method Toggle only in main view */}
                    {viewLevel === 'main' && (
                      <View className="flex-row flex-wrap justify-center mt-4 gap-4">
                        <View className="flex-row items-center">
                          <Text className="mr-2 text-sm text-gray-600">
                            View by Payment Method
                          </Text>
                          <Switch
                            value={showByPayment}
                            onValueChange={setShowByPayment}
                            trackColor={{ false: colors.gray[300], true: colors.anime.lavender }}
                            thumbColor={showByPayment ? colors.anime.purple : colors.white}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
      <BottomNav />
    </View>
  );
}
