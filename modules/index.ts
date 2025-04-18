// Module registry for the Centwise app
// This file serves as a central registry for all app modules

// Import and re-export module interfaces
import * as expenses from "./expenses";
import * as payments from "./payments";

// Export all modules
export { expenses, payments };

// Module metadata for dynamic discovery
export const moduleRegistry = {
  expenses: {
    name: "Expenses",
    description: "Manages expense tracking and categorization",
    version: "1.0.0",
    // Add any additional metadata as needed
  },
  payments: {
    name: "Payments",
    description: "Manages payment methods and transactions",
    version: "1.0.0",
    // Add any additional metadata as needed
  },
  // Add other modules here as they are developed
};
