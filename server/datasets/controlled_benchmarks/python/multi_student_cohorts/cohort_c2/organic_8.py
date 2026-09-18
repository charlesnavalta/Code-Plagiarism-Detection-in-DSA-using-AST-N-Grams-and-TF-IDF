"""
0/1 Knapsack (DP) - Organic Submission #8
Functional style using a dataclass for items and full type hints.
"""

from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class Item:
    weight: int
    value: int


def max_value(items: List[Item], capacity: int) -> int:
    dp: List[int] = [0] * (capacity + 1)

    for item in items:
        for cap in range(capacity, item.weight - 1, -1):
            candidate = dp[cap - item.weight] + item.value
            if candidate > dp[cap]:
                dp[cap] = candidate

    return dp[capacity]


def main() -> None:
    items = [Item(2, 3), Item(3, 4), Item(4, 5), Item(5, 6)]
    print(max_value(items, 5))


if __name__ == "__main__":
    main()
