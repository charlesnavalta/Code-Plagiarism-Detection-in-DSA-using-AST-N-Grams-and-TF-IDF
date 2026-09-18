"""
0/1 Knapsack (DP) - Organic Submission #3
Top-down recursive solution with a manual memoization dictionary.
"""


def solve(index, remaining_capacity, weights, values, memo):
    if index == len(weights) or remaining_capacity == 0:
        return 0

    key = (index, remaining_capacity)
    if key in memo:
        return memo[key]

    # option 1: skip current item
    best = solve(index + 1, remaining_capacity, weights, values, memo)

    # option 2: take current item, if it fits
    if weights[index] <= remaining_capacity:
        taken = values[index] + solve(
            index + 1, remaining_capacity - weights[index], weights, values, memo
        )
        best = max(best, taken)

    memo[key] = best
    return best


def knapsack(weights, values, capacity):
    memo = {}
    return solve(0, capacity, weights, values, memo)


if __name__ == "__main__":
    w = [2, 2, 4, 3]
    v = [5, 3, 6, 4]
    c = 6
    print(knapsack(w, v, c))
