// Two Sum (hash map) - DISGUISE: dead-code injected
// Derived from unique_1.py. Same algorithm and output, but padded with
// inert code: unused imports, unused helper function, dead counter.

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    private static boolean DEBUG_MODE = false;

    private static int unusedHelper(int x) {
        return x * 2 + 1;
    }

    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        int dummyCounter = 0;
        for (int index = 0; index < nums.length; index++) {
            dummyCounter++;
            int value = nums[index];
            int complement = target - value;
            if (DEBUG_MODE) {
                System.out.println("checking " + value + " against " + complement);
            }
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), index};
            }
            seen.put(value, index);
        }
        if (dummyCounter < 0) {
            int deadVal = unusedHelper(dummyCounter);
            return new int[]{deadVal};
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
