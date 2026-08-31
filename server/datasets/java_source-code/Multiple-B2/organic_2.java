// Two Sum (hash map) - organic submission 2
// Two-pass: build the full index map first, then scan for complements.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            indexMap.put(nums[i], i);
        }

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (indexMap.containsKey(complement) && indexMap.get(complement) != i) {
                return new int[]{i, indexMap.get(complement)};
            }
        }
        return null;
    }

    public static void main(String[] args) {
        int[] nums = {3, 2, 4};
        int target = 6;
        System.out.println("Indices: " + Arrays.toString(twoSum(nums, target)));
    }
}
