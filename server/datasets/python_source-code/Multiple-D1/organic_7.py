"""
Quick Sort - Organic Submission #7
Functional-style list comprehension Quick Sort.
"""

def quick_sort_pythonic(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort_pythonic(left) + middle + quick_sort_pythonic(right)

if __name__ == "__main__":
    nums = [33, 10, 55, 71, 29, 62]
    print(quick_sort_pythonic(nums))
