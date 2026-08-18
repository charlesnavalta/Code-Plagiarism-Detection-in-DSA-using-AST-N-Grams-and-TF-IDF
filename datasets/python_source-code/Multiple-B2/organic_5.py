# Two Sum (hash map) - organic submission 5
# Manual while loop with an index counter instead of enumerate.

def two_sum(nums, target):
    seen = {}
    i = 0
    while i < len(nums):
        complement = target - nums[i]
        if complement in seen:
            return [seen[complement], i]
        seen[nums[i]] = i
        i += 1
    return None


if __name__ == "__main__":
    nums = [10, 15, 3, 7]
    target = 17
    print("Indices:", two_sum(nums, target))
