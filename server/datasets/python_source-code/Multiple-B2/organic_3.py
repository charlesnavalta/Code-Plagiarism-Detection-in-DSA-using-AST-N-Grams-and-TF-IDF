# Two Sum (hash map) - organic submission 3
# Uses collections.defaultdict(list) to robustly handle duplicate values.

from collections import defaultdict


def two_sum(nums, target):
    positions = defaultdict(list)
    for idx, val in enumerate(nums):
        positions[val].append(idx)

    for idx, val in enumerate(nums):
        complement = target - val
        candidates = positions.get(complement)
        if candidates:
            for cand_idx in candidates:
                if cand_idx != idx:
                    return sorted([idx, cand_idx])
    return None


if __name__ == "__main__":
    nums = [3, 3, 4, 5]
    target = 6
    print("Indices:", two_sum(nums, target))
