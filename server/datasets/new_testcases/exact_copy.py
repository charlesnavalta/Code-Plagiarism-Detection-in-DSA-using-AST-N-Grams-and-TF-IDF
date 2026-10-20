"""
Binary Search Suite - Submission by Isabelle
Approach: Defensive, type-annotated binary search toolkit returning SearchResult objects,
including first occurrence, last occurrence, and range counting with validation.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple


@dataclass
class SearchResult:
    index: Optional[int]
    comparisons: int
    found: bool


def validate_sorted(arr: List[int]) -> bool:
    return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))


def binary_search(arr: List[int], target: int) -> SearchResult:
    if not validate_sorted(arr):
        raise ValueError("Array must be sorted")
    lo, hi = 0, len(arr) - 1
    comps = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        comps += 1
        if arr[mid] == target:
            return SearchResult(index=mid, comparisons=comps, found=True)
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return SearchResult(index=None, comparisons=comps, found=False)


def find_first_occurrence(arr: List[int], target: int) -> Optional[int]:
    lo, hi = 0, len(arr) - 1
    first_idx = None
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            first_idx = mid
            hi = mid - 1
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return first_idx


def find_last_occurrence(arr: List[int], target: int) -> Optional[int]:
    lo, hi = 0, len(arr) - 1
    last_idx = None
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            last_idx = mid
            lo = mid + 1
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return last_idx


def count_frequency(arr: List[int], target: int) -> int:
    first = find_first_occurrence(arr, target)
    if first is None:
        return 0
    last = find_last_occurrence(arr, target)
    return last - first + 1


def main():
    sample = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    res = binary_search(sample, 12)
    print("Found:", res.found, "at index:", res.index)
    print("Frequency of 12:", count_frequency(sample, 12))


if __name__ == "__main__":
    main()
