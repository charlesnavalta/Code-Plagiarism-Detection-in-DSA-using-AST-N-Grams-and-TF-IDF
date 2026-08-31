"""
Quick Sort - Structural Modification #1
Derived from organic_4: helper swap extracted, statement reordered.
"""

import random

def swap(arr, a, b):
    temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp

def partition_random(arr, low, high):
    chosen = random.randint(low, high)
    swap(arr, chosen, high)
    target = arr[high]
    border = low - 1
    for step in range(low, high):
        if arr[step] <= target:
            border += 1
            swap(arr, border, step)
    swap(arr, border + 1, high)
    return border + 1

def randomized_quick_sort(arr, low, high):
    if low >= high:
        return
    idx = partition_random(arr, low, high)
    randomized_quick_sort(arr, idx + 1, high)
    randomized_quick_sort(arr, low, idx - 1)

if __name__ == "__main__":
    nums = [10, 80, 30, 90, 40, 50, 70]
    randomized_quick_sort(nums, 0, len(nums) - 1)
    print(nums)
