/**
 * Session storage persistence layer
 * Handles saving/loading bill state and undo snapshots
 */

import { BillState } from "./types";

const STORAGE_KEY = "bgn_eur_calculator_state";
const SNAPSHOT_KEY = "bgn_eur_calculator_snapshot";

/**
 * Load bill state from sessionStorage
 * Returns null if no saved state exists or if parsing fails
 */
export function loadBillState(): BillState | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed as BillState;
  } catch (error) {
    console.error("Failed to load bill state:", error);
    return null;
  }
}

/**
 * Save bill state to sessionStorage
 * Uses debouncing in the component layer to avoid excessive writes
 */
export function saveBillState(state: BillState): void {
  if (typeof window === "undefined") return;
  
  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save bill state:", error);
  }
}

/**
 * Save a snapshot of the bill state before clearing
 * This enables single-level undo functionality
 */
export function saveLastSnapshot(state: BillState): void {
  if (typeof window === "undefined") return;
  
  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem(SNAPSHOT_KEY, serialized);
  } catch (error) {
    console.error("Failed to save snapshot:", error);
  }
}

/**
 * Load the last snapshot for undo functionality
 */
export function loadLastSnapshot(): BillState | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = sessionStorage.getItem(SNAPSHOT_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed as BillState;
  } catch (error) {
    console.error("Failed to load snapshot:", error);
    return null;
  }
}

/**
 * Clear the undo snapshot after it has been used
 */
export function clearLastSnapshot(): void {
  if (typeof window === "undefined") return;
  
  try {
    sessionStorage.removeItem(SNAPSHOT_KEY);
  } catch (error) {
    console.error("Failed to clear snapshot:", error);
  }
}

