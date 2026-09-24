/*
 * 0/1 Knapsack (DP) - Organic Submission #1
 * Classic bottom-up 2D DP table.
 */

class Solution {
    public static int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] table = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    table[i][w] = Math.max(
                        table[i - 1][w],
                        values[i - 1] + table[i - 1][w - weights[i - 1]]
                    );
                } else {
                    table[i][w] = table[i - 1][w];
                }
            }
        }
        return table[n][capacity];
    }

    public static void main(String[] args) {
        int[] weights = {2, 3, 4, 5};
        int[] values = {3, 4, 5, 6};
        int capacity = 5;
        System.out.println("Max value: " + knapsack(weights, values, capacity));
    }
}
