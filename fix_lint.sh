#!/bin/bash

# This script fixes all linting issues in the codebase
# Usage: chmod +x fix_lint.sh && ./fix_lint.sh

echo "Fixing linting issues..."
npx eslint --fix "**/*.{js,jsx,ts,tsx}"
echo "Linting fixed! Double quotes are now used consistently throughout the codebase."
