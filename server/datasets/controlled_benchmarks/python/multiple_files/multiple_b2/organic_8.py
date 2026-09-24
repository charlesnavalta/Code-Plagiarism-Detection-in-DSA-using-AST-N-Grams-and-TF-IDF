# Two Sum (hash map) - organic submission 8
# Compact style using the walrus operator with dict.get().

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if (match := seen.get(target - num)) is not None:
            return [match, i]
        seen[num] = i
    return None


if __name__ == "__main__":
    nums = [1, 2, 3, 9]
    target = 11
    print("Indices:", two_sum(nums, target))
