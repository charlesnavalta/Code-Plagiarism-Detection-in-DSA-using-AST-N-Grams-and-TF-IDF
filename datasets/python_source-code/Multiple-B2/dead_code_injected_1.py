# Two Sum (hash map) - DISGUISE: dead-code injected
# Derived from unique_1.py. Same algorithm and output, but padded with
# inert code that never affects behavior: unused imports, an unused flag,
# an unused helper function, a dead counter, and an unreachable branch.

import os  # unused import
import sys  # unused import


DEBUG_MODE = False  # unused flag, always False


def _unused_helper(x):
    # dead code: never called anywhere
    return x * 2 + 1


def two_sum(nums, target):
    seen = {}
    dummy_counter = 0  # tracked but never used for anything meaningful
    for index, value in enumerate(nums):
        dummy_counter += 1
        complement = target - value
        if DEBUG_MODE:
            print(f"checking {value} against {complement}")  # never runs
        if complement in seen:
            return [seen[complement], index]
        seen[value] = index
    if dummy_counter < 0:
        # unreachable: dummy_counter can never be negative
        return _unused_helper(dummy_counter)
    return None


def main():
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print("Two Sum result:", result)


if __name__ == "__main__":
    main()
