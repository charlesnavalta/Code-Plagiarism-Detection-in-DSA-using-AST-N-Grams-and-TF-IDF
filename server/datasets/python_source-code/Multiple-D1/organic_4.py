"""
Quick Sort - Organic Submission #4
Randomized pivot selection to prevent worst-case O(n^2).
"""

import random

def partition_random(arr, low, high):
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx]
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def randomized_quick_sort(arr, low, high):
    if low < high:
        pi = partition_random(arr, low, high)
        randomized_quick_sort(arr, low, pi - 1)
        randomized_quick_sort(arr, pi + 1, high)

if __name__ == "__main__":
    nums = [10, 80, 30, 90, 40, 50, 70]
    randomized_quick_sort(nums, 0, len(nums) - 1)
    print(nums)
