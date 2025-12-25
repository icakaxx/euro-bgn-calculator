// Simple ID generator for bill items
let counter = 0;

export function generateId(): string {
  counter++;
  return `item_${Date.now()}_${counter}`;
}

