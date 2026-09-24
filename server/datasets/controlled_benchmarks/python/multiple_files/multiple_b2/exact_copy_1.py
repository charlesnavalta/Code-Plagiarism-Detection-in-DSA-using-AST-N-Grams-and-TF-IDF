# Two Sum (hash map) - unique source
# This is the "true source" file for this test case. It should match
# exact_copy_1.py, dead_code_injected_1.py, and logic_substituted_1.py.

def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return [seen[complement], index]
        seen[value] = index
    return None


def main():
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print("Two Sum result:", result)


if __name__ == "__main__":
    main()
