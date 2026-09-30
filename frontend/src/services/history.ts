/**
 * ASTRA VISION Local History Storage Service
 * Built by Preetham Alawandimath
 */

import { HistoryItem } from '../types';

const STORAGE_KEY = 'astra_vision_analysis_history';
const MAX_LOCAL_ENTRIES = 50;

export function loadHistoryItems(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history from localStorage:', e);
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem): void {
  try {
    const current = loadHistoryItems();
    // Prepend new item
    const updated = [item, ...current.filter((i) => i.id !== item.id)].slice(
      0,
      MAX_LOCAL_ENTRIES
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save history entry (quota exceeded or disabled):', e);
  }
}

export function removeHistoryItem(id: string): HistoryItem[] {
  try {
    const current = loadHistoryItems();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove history entry:', e);
    return loadHistoryItems();
  }
}

export function clearHistoryStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}
