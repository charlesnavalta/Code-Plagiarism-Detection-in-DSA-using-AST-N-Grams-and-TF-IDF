"""
0/1 Knapsack (DP) - Organic Submission #7
Accepts items as a list of (name, weight, value) tuples and iterates
capacity as the outer loop, items as the inner loop (column-major order).
"""


def knapsack(items, capacity):
    n = len(items)
    dp = [[0] * (n + 1) for _ in range(capacity + 1)]

    for cap in range(capacity + 1):
        for idx in range(1, n + 1):
            _, weight, value = items[idx - 1]
            if weight <= cap:
                dp[cap][idx] = max(dp[cap][idx - 1], value + dp[cap - weight][idx - 1])
            else:
                dp[cap][idx] = dp[cap][idx - 1]

    return dp[capacity][n]


if __name__ == "__main__":
    items = [
        ("gold_bar", 3, 60),
        ("silver_bar", 2, 40),
        ("gem", 4, 70),
        ("statue", 5, 90),
    ]
    print(knapsack(items, 8))
