# Two Sum (hash map) - organic submission 6
# Recursive formulation, still backed by a hash map accumulator.

def two_sum_recursive(nums, target, index=0, seen=None):
    if seen is None:
        seen = {}
    if index >= len(nums):
        return None
    complement = target - nums[index]
    if complement in seen:
        return [seen[complement], index]
    seen[nums[index]] = index
    return two_sum_recursive(nums, target, index + 1, seen)


if __name__ == "__main__":
    nums = [2, 5, 5, 11]
    target = 10
    print("Indices:", two_sum_recursive(nums, target))
