// Two Sum (hash map) - organic submission 9
// Pair search scanning for the first valid complement.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {0, 4, 3, 0};
        int target = 0;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}
