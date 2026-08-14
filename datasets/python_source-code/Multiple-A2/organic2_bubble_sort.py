"""
Bubble Sort - organic2
Approach: Nested for loops with the inner loop range shrinking each
pass (n - i - 1), swapping using an explicit temp variable instead
of tuple assignment.
"""


def sort_list(values):
    n = len(values)
    for i in range(n):
        for j in range(0, n - i - 1):
            if values[j] > values[j + 1]:
                temp = values[j]
                values[j] = values[j + 1]
                values[j + 1] = temp
    return values


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Result:", sort_list(ARR))
