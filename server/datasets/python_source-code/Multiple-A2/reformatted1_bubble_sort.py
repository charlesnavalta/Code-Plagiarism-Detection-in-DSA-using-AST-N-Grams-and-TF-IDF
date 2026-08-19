"""
Bubble Sort - reformatted1
Approach: Identical logic and identifier names to unique1 - only
whitespace, indentation, and statement grouping have changed.
"""
from typing import List
class BubbleSorter:
    def __init__(self, data: List[int]) -> None:
        self.data = list(data); self.swaps = 0; self.passes = 0
    def sort(self) -> List[int]:
        n = len(self.data)
        for i in range(n - 1):
            self.passes += 1
            swapped_this_pass = False
            for j in range(n - 1 - i):
                if self.data[j] > self.data[j + 1]:
                    self.data[j], self.data[j + 1] = self.data[j + 1], self.data[j]; self.swaps += 1; swapped_this_pass = True
            if not swapped_this_pass: break
        return self.data
def main() -> None:
    arr = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    sorter = BubbleSorter(arr)
    result = sorter.sort()
    print(f"Sorted: {result}")
    print(f"Swaps: {sorter.swaps}, Passes: {sorter.passes}")
if __name__ == "__main__":
    main()
