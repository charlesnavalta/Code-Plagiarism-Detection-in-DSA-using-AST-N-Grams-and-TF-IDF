# TS-D 1: Student B - Recursive Binary Search (Standard Submitted)
def binary_search_recursive(data, target, low, high):
    if low > high:
        return -1
    mid = (low + high) // 2
    if data[mid] == target:
        return mid
    elif data[mid] > target:
        return binary_search_recursive(data, target, low, mid - 1)
    else:
        return binary_search_recursive(data, target, mid + 1, high)

if __name__ == "__main__":
    test_list = [1, 3, 5, 7, 9, 11, 13]
    result = binary_search_recursive(test_list, 7, 0, len(test_list) - 1)
    print(f"Target found at index: {result}")
