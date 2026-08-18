"""
Binary Search - Submission by Isabelle
Approach: Defensive, fully type-hinted implementation that returns a
small SearchResult object (index + comparison count) instead of a
bare int, and validates that the input is actually sorted first.
This is the "unique" baseline for this scenario.
"""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class SearchResult:
    index: Optional[int]
    comparisons: int

    @property
    def found(self) -> bool:
        return self.index is not None


def is_sorted(arr: List[int]) -> bool:
    return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))


def binary_search(arr: List[int], target: int) -> SearchResult:
    if not is_sorted(arr):
        raise ValueError("binary_search requires a sorted list")

    lo, hi = 0, len(arr) - 1
    comparisons = 0

    while lo <= hi:
        mid = (lo + hi) // 2
        comparisons += 1

        if arr[mid] == target:
            return SearchResult(index=mid, comparisons=comparisons)
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1

    return SearchResult(index=None, comparisons=comparisons)


def main() -> None:
    arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    target = 23

    result = binary_search(arr, target)
    if result.found:
        print(f"Found {target} at index {result.index} ({result.comparisons} comparisons)")
    else:
        print(f"{target} not found ({result.comparisons} comparisons)")


if __name__ == "__main__":
    main()
