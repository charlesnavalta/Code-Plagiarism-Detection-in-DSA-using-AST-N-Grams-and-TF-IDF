"""
Quick Sort - Organic Submission #8
Iterative Quick Sort using an explicit stack of index ranges.
"""

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort_iterative(arr):
    stack = [(0, len(arr) - 1)]
    while stack:
        low, high = stack.pop()
        if low < high:
            p = partition(arr, low, high)
            stack.append((low, p - 1))
            stack.append((p + 1, high))

if __name__ == "__main__":
    data = [45, 12, 85, 32, 89, 39, 69, 44]
    quick_sort_iterative(data)
    print(data)
