/*
 * 0/1 Knapsack (DP) - Organic Submission #2
 * Space-optimized 1D DP array, iterating capacity in reverse.
 */

class Solution {
    public static int knapsack1d(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];

        for (int i = 0; i < weights.length; i++) {
            int w_i = weights[i];
            int v_i = values[i];
            for (int cap = capacity; cap >= w_i; cap--) {
                dp[cap] = Math.max(dp[cap], dp[cap - w_i] + v_i);
            }
        }
        return dp[capacity];
    }

    public static void main(String[] args) {
        int[] itemsWeight = {1, 3, 4, 5};
        int[] itemsValue = {1, 4, 5, 7};
        int cap = 7;
        System.out.println(knapsack1d(itemsWeight, itemsValue, cap));
    }
}
