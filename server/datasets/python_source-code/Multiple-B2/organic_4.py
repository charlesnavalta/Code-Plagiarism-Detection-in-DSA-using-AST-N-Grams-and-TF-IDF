# Two Sum (hash map) - organic submission 4
# LeetCode-idiomatic class Solution style.

class Solution:
    def twoSum(self, nums, target):
        lookup = {}
        for index, value in enumerate(nums):
            need = target - value
            if need in lookup:
                return [lookup[need], index]
            lookup[value] = index
        return []


if __name__ == "__main__":
    sol = Solution()
    result = sol.twoSum([1, 5, 3, 8], 11)
    print("Indices:", result)
