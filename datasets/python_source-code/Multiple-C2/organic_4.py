"""
0/1 Knapsack (DP) - Organic Submission #4
Top-down recursion using functools.lru_cache instead of a manual dict.
"""

from functools import lru_cache


def knapsack(weights, values, capacity):
    weights = tuple(weights)
    values = tuple(values)
    n = len(weights)

    @lru_cache(maxsize=None)
    def helper(i, cap):
        if i == n or cap == 0:
            return 0
        without_item = helper(i + 1, cap)
        if weights[i] > cap:
            return without_item
        with_item = values[i] + helper(i + 1, cap - weights[i])
        return max(without_item, with_item)

    result = helper(0, capacity)
    helper.cache_clear()
    return result


if __name__ == "__main__":
    weights = [1, 2, 3]
    values = [6, 10, 12]
    capacity = 5
    print(knapsack(weights, values, capacity))
