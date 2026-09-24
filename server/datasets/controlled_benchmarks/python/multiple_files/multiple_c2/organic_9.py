"""
0/1 Knapsack (DP) - Organic Submission #9
Verbose, heavily-commented beginner style with basic input validation.
"""


def knapsack_solver(item_weights, item_values, max_capacity):
    # basic validation
    if len(item_weights) != len(item_values):
        raise ValueError("weights and values must be the same length")
    if max_capacity < 0:
        raise ValueError("capacity cannot be negative")

    num_items = len(item_weights)

    # create a (num_items+1) x (max_capacity+1) grid filled with zeros
    grid = []
    for row in range(num_items + 1):
        grid.append([0 for _ in range(max_capacity + 1)])

    # fill the grid row by row
    for item_index in range(1, num_items + 1):
        current_weight = item_weights[item_index - 1]
        current_value = item_values[item_index - 1]

        for current_capacity in range(max_capacity + 1):
            # can we even fit this item?
            if current_weight > current_capacity:
                # nope, so the best we can do is skip it
                grid[item_index][current_capacity] = grid[item_index - 1][current_capacity]
            else:
                # we can choose to take it or leave it - pick the better option
                value_if_skipped = grid[item_index - 1][current_capacity]
                value_if_taken = current_value + grid[item_index - 1][current_capacity - current_weight]
                grid[item_index][current_capacity] = max(value_if_skipped, value_if_taken)

    return grid[num_items][max_capacity]


if __name__ == "__main__":
    weights = [1, 2, 3, 8, 7, 4]
    values = [20, 5, 10, 40, 15, 25]
    capacity = 10
    best = knapsack_solver(weights, values, capacity)
    print("Best possible value:", best)
