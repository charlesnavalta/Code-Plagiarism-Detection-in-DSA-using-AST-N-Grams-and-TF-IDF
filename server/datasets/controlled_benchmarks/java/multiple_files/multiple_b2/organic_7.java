// Two Sum (hash map) - organic submission 7
// Two-sum check checking null value lookup instead of containsKey.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            Integer matchIndex = seen.get(complement);
            if (matchIndex != null) {
                return new int[]{matchIndex, i};
            }
            seen.put(nums[i], i);
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {4, 6, 8, 10};
        int target = 14;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}
