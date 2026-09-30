"""
ASTRA VISION Lightweight In-Memory History Service
Built by Preetham Alawandimath
"""

import threading
from typing import List, Optional
from ..api.schemas import HistoryItem

_history_lock = threading.Lock()
_history_items: List[HistoryItem] = []
MAX_HISTORY_ITEMS = 50


def add_history_entry(item: HistoryItem) -> HistoryItem:
    global _history_items
    with _history_lock:
        _history_items.insert(0, item)
        if len(_history_items) > MAX_HISTORY_ITEMS:
            _history_items = _history_items[:MAX_HISTORY_ITEMS]
    return item


def get_history_entries(
    search: Optional[str] = None,
    sort_by: str = "newest",
    filter_class: Optional[str] = None,
) -> List[HistoryItem]:
    with _history_lock:
        items = list(_history_items)

    if search:
        s = search.lower()
        items = [i for i in items if s in i.primary_prediction.lower() or s in i.filename.lower()]

    if filter_class and filter_class != "ALL":
        items = [i for i in items if i.primary_prediction == filter_class]

    if sort_by == "confidence":
        items.sort(key=lambda x: x.confidence, reverse=True)
    elif sort_by == "oldest":
        items.sort(key=lambda x: x.timestamp)
    else:  # newest
        pass

    return items


def delete_history_entry(entry_id: str) -> bool:
    global _history_items
    with _history_lock:
        initial_len = len(_history_items)
        _history_items = [i for i in _history_items if i.id != entry_id]
        return len(_history_items) < initial_len


def clear_all_history() -> int:
    global _history_items
    with _history_lock:
        count = len(_history_items)
        _history_items.clear()
        return count
