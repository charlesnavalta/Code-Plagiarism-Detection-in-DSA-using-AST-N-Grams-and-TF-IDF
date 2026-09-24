"""
0/1 Knapsack (DP) - Organic Submission #6
Bottom-up DP that also reconstructs which items were selected.
"""


def knapsack_with_items(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for cap in range(capacity + 1):
            dp[i][cap] = dp[i - 1][cap]
            if weights[i - 1] <= cap:
                candidate = values[i - 1] + dp[i - 1][cap - weights[i - 1]]
                if candidate > dp[i][cap]:
                    dp[i][cap] = candidate

    # backtrack to find which items were taken
    chosen_items = []
    cap = capacity
    for i in range(n, 0, -1):
        if dp[i][cap] != dp[i - 1][cap]:
            chosen_items.append(i - 1)
            cap -= weights[i - 1]

    chosen_items.reverse()
    return dp[n][capacity], chosen_items


if __name__ == "__main__":
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    max_value, items = knapsack_with_items(weights, values, 5)
    print(f"Max value: {max_value}, items taken (indices): {items}")
