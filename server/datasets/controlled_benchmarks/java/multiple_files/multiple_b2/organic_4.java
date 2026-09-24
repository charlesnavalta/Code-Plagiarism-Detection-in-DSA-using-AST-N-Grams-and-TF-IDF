// Two Sum (hash map) - organic submission 4
// LeetCode-idiomatic class Solution style.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> lookup = new HashMap<>();
        for (int index = 0; index < nums.length; index++) {
            int need = target - nums[index];
            if (lookup.containsKey(need)) {
                return new int[]{lookup.get(need), index};
            }
            lookup.put(nums[index], index);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.twoSum(new int[]{1, 5, 3, 8}, 11);
        System.out.println("Indices: " + Arrays.toString(result));
    }
}
