"""
0/1 Knapsack (DP) - Unique Submission
A genuinely distinct approach: branch-and-bound backtracking with pruning
via a fractional-knapsack upper bound, instead of a bottom-up/top-down DP
table. Still solves the same 0/1 knapsack problem exactly.
"""


def bound(index, current_weight, current_value, weights, values, capacity):
    """Upper bound on achievable value from this state, using the
    fractional relaxation of the remaining items (sorted by value/weight)."""
    if current_weight >= capacity:
        return 0

    total_value = current_value
    remaining_capacity = capacity - current_weight

    for i in range(index, len(weights)):
        if weights[i] <= remaining_capacity:
            remaining_capacity -= weights[i]
            total_value += values[i]
        else:
            total_value += values[i] * (remaining_capacity / weights[i])
            break

    return total_value


def knapsack_branch_and_bound(weights, values, capacity):
    # sort items by value-density descending; keeps bounding effective
    order = sorted(range(len(weights)), key=lambda i: values[i] / weights[i], reverse=True)
    sorted_weights = [weights[i] for i in order]
    sorted_values = [values[i] for i in order]

    best_value = 0
    n = len(weights)

    def explore(index, current_weight, current_value):
        nonlocal best_value

        if current_weight <= capacity and current_value > best_value:
            best_value = current_value

        if index == n:
            return

        # prune this branch if even the optimistic bound can't beat the best found
        if bound(index, current_weight, current_value, sorted_weights, sorted_values, capacity) <= best_value:
            return

        # branch: include current item
        if current_weight + sorted_weights[index] <= capacity:
            explore(index + 1, current_weight + sorted_weights[index], current_value + sorted_values[index])

        # branch: exclude current item
        explore(index + 1, current_weight, current_value)

    explore(0, 0, 0)
    return best_value


if __name__ == "__main__":
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    capacity = 5
    print(knapsack_branch_and_bound(weights, values, capacity))
