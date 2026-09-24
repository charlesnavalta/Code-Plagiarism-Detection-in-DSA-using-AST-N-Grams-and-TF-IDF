// Two Sum (hash map) - unique source
// This is the "true source" file for this test case. It should match
// exact_copy_1.py, dead_code_injected_1.py, and logic_substituted_1.py.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int index = 0; index < nums.length; index++) {
            int value = nums[index];
            int complement = target - value;
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), index};
            }
            seen.put(value, index);
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Two Sum result: " + Arrays.toString(result));
    }
}
