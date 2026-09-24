# Two Sum (hash map) - organic submission 7
# Uses try/except KeyError instead of an 'in' membership check.

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        try:
            match_index = seen[complement]
        except KeyError:
            seen[num] = i
            continue
        return [match_index, i]
    return None


if __name__ == "__main__":
    nums = [4, 6, 8, 10]
    target = 14
    print("Indices:", two_sum(nums, target))
