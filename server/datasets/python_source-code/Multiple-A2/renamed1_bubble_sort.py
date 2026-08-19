"""
Bubble Sort - renamed1
Approach: Same underlying design as unique1, but every class name,
method name, variable name, and comment has been changed. Structure
and control flow are identical to the baseline.
"""

from typing import List


class ArraySorterUtility:
    def __init__(self, values: List[int]) -> None:
        self.values = list(values)
        self.exchange_count = 0
        self.round_count = 0

    def process(self) -> List[int]:
        length = len(self.values)
        for outer_index in range(length - 1):
            self.round_count += 1
            did_exchange = False
            for inner_index in range(length - 1 - outer_index):
                if self.values[inner_index] > self.values[inner_index + 1]:
                    self.values[inner_index], self.values[inner_index + 1] = (
                        self.values[inner_index + 1],
                        self.values[inner_index],
                    )
                    self.exchange_count += 1
                    did_exchange = True
            if not did_exchange:
                break
        return self.values


def run() -> None:
    numbers = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    utility = ArraySorterUtility(numbers)
    output = utility.process()
    print(f"Sorted: {output}")
    print(f"Swaps: {utility.exchange_count}, Passes: {utility.round_count}")


if __name__ == "__main__":
    run()
