"""
0/1 Knapsack (DP) - Organic Submission #1
Classic bottom-up 2D DP table.
"""


def knapsack(weights, values, capacity):
    n = len(weights)
    table = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                table[i][w] = max(
                    table[i - 1][w],
                    values[i - 1] + table[i - 1][w - weights[i - 1]],
                )
            else:
                table[i][w] = table[i - 1][w]

    return table[n][capacity]


if __name__ == "__main__":
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    capacity = 5
    print("Max value:", knapsack(weights, values, capacity))
