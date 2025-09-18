#!/bin/bash

set -e

# Run linting
echo "Running lint..."
pnpm turbo run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Please fix the issues before committing."
  exit 1
fi

# Run tests
echo "Running tests..."
pnpm turbo run test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix the issues before committing."
  exit 1
fi

# Run build
echo "Running build..."
pnpm turbo run build
if [ $? -ne 0 ]; then
  echo "Build failed. Please fix the issues before committing."
  exit 1
fi

echo "All checks passed!"
exit 0