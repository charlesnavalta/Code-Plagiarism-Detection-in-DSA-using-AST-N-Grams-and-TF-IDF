# Two Sum (hash map) - organic submission 2
# Two-pass: build the full index map first, then scan for complements.

def two_sum(nums, target):
    index_map = {}
    for i, num in enumerate(nums):
        index_map[num] = i

    for i, num in enumerate(nums):
        complement = target - num
        if complement in index_map and index_map[complement] != i:
            return [i, index_map[complement]]
    return None


def main():
    nums = [3, 2, 4]
    target = 6
    print("Indices:", two_sum(nums, target))


if __name__ == "__main__":
    main()
