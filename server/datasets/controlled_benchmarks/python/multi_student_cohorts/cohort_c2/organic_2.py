"""
0/1 Knapsack (DP) - Organic Submission #2
Space-optimized 1D DP array, iterating capacity in reverse.
"""


def knapsack_1d(weights, values, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        w_i, v_i = weights[i], values[i]
        for cap in range(capacity, w_i - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w_i] + v_i)

    return dp[capacity]


if __name__ == "__main__":
    items_weight = [1, 3, 4, 5]
    items_value = [1, 4, 5, 7]
    cap = 7
    print(knapsack_1d(items_weight, items_value, cap))
