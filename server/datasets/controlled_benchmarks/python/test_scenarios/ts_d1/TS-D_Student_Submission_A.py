# TS-D 1: Student A - Iterative Binary Search (Resubmission Unlocked)
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

if __name__ == "__main__":
    test_list = [1, 3, 5, 7, 9, 11, 13]
    result = binary_search(test_list, 7)
    print(f"Target found at index: {result}")
