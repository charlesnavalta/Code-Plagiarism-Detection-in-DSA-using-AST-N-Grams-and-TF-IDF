// Two Sum (hash map) - organic submission 5
// Manual while loop with an index counter.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        int i = 0;
        while (i < nums.length) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
            i++;
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {10, 15, 3, 7};
        int target = 17;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}
