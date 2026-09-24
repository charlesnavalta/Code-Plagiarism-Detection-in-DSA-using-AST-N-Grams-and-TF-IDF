"""
Binary Search Suite - Submission by Andrea
Approach: Iterative search using left/right naming, overflow-safe middle calculation,
and structured dictionary response outputs.
"""


def safe_search(values, key):
    left = 0
    right = len(values) - 1
    steps = 0
    while left <= right:
        steps += 1
        middle = left + (right - left) // 2
        if values[middle] == key:
            return {"status": "success", "index": middle, "iterations": steps}
        if values[middle] < key:
            left = middle + 1
        else:
            right = middle - 1
    return {"status": "not_found", "index": -1, "iterations": steps}


def scan_range_endpoints(values, key):
    res = safe_search(values, key)
    if res["status"] == "not_found":
        return None
    mid_idx = res["index"]
    start = mid_idx
    while start > 0 and values[start - 1] == key:
        start -= 1
    end = mid_idx
    while end < len(values) - 1 and values[end + 1] == key:
        end += 1
    total = (end - start) + 1
    return {"first": start, "last": end, "count": total}


def run_diagnostics(dataset, target_val):
    single_res = safe_search(dataset, target_val)
    range_res = scan_range_endpoints(dataset, target_val)
    print("Single Search:", single_res)
    print("Range Analysis:", range_res)


if __name__ == "__main__":
    items = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    run_diagnostics(items, 12)
