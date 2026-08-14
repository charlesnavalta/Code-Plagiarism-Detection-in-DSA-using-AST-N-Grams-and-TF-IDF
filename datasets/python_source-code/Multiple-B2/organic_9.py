# Two Sum (hash map) - organic submission 9
# Generator-based: yields every valid pair, caller takes the first one.

def two_sum_pairs(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            yield [seen[complement], i]
        seen[num] = i


def two_sum(nums, target):
    for pair in two_sum_pairs(nums, target):
        return pair
    return None


if __name__ == "__main__":
    nums = [0, 4, 3, 0]
    target = 0
    print("Indices:", two_sum(nums, target))
