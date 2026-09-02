# Organic Student Submission 16: Independent Algorithm Paradigm
def iterative_quicksort(arr):
    if len(arr) <= 1: return arr
    stack = [(0, len(arr) - 1)]
    while stack:
        low, high = stack.pop()
        if low < high:
            pivot = arr[high]
            i = low - 1
            for j in range(low, high):
                if arr[j] <= pivot:
                    i += 1
                    arr[i], arr[j] = arr[j], arr[i]
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            pi = i + 1
            stack.append((low, pi - 1))
            stack.append((pi + 1, high))
    return arr
