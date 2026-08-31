// Two Sum (hash map) - organic submission 6
// Recursive formulation, still backed by a hash map accumulator.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSumRecursive(int[] nums, int target, int index, Map<Integer, Integer> seen) {
        if (index >= nums.length) {
            return null;
        }
        int complement = target - nums[index];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), index};
        }
        seen.put(nums[index], index);
        return twoSumRecursive(nums, target, index + 1, seen);
    }

    public static int[] twoSum(int[] nums, int target) {
        return twoSumRecursive(nums, target, 0, new HashMap<>());
    }

    public static void main(String[] args) {
        int[] nums = {2, 5, 5, 11};
        int target = 10;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}
