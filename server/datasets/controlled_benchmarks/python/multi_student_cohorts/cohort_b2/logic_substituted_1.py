# Two Sum (hash map) - DISGUISE: logic-substituted
# Derived from unique_1.py. The membership check "if complement in seen"
# has been rewritten as its De Morgan's-law equivalent
# "if not (complement not in seen)" - logically identical, syntactically
# different comparison, matching the "swap an equivalent boolean/math
# expression" disguise family.

def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        complement = target - value
        if not (complement not in seen):
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
