"""
Binary Search Suite - Submission by Sophia
Approach: Infinite loop state-machine architecture with explicit break conditions,
transition tracking, and search audit logging.
"""


def execute_search_loop(arr, target):
    lo = 0
    hi = len(arr) - 1
    audit_trail = []
    found_idx = -1

    while True:
        if lo > hi:
            break
        mid = (lo + hi) // 2
        val = arr[mid]
        audit_trail.append({"mid": mid, "val": val, "bounds": (lo, hi)})
        if val == target:
            found_idx = mid
            break
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1

    return {"index": found_idx, "trail": audit_trail}


def compute_boundaries(arr, target):
    search_res = execute_search_loop(arr, target)
    idx = search_res["index"]
    if idx == -1:
        return (0, -1, -1)
    curr_low = idx
    while curr_low > 0 and arr[curr_low - 1] == target:
        curr_low -= 1
    curr_high = idx
    while curr_high < len(arr) - 1 and arr[curr_high + 1] == target:
        curr_high += 1
    count = (curr_high - curr_low) + 1
    return (count, curr_low, curr_high)


if __name__ == "__main__":
    data = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    ans = execute_search_loop(data, 12)
    qty, start, end = compute_boundaries(data, 12)
    print("Search Result:", ans["index"])
    print(f"Occurrences: {qty} (Range: {start} to {end})")
