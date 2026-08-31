/*
 * 0/1 Knapsack (DP) - Organic Submission #6
 * Bottom-up DP that also reconstructs which items were selected.
 */

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Solution {
    public static int knapsackWithItems(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int cap = 0; cap <= capacity; cap++) {
                dp[i][cap] = dp[i - 1][cap];
                if (weights[i - 1] <= cap) {
                    int candidate = values[i - 1] + dp[i - 1][cap - weights[i - 1]];
                    if (candidate > dp[i][cap]) {
                        dp[i][cap] = candidate;
                    }
                }
            }
        }

        List<Integer> chosenItems = new ArrayList<>();
        int cap = capacity;
        for (int i = n; i > 0; i--) {
            if (dp[i][cap] != dp[i - 1][cap]) {
                chosenItems.add(i - 1);
                cap -= weights[i - 1];
            }
        }

        Collections.reverse(chosenItems);
        System.out.println("Items taken: " + chosenItems);
        return dp[n][capacity];
    }

    public static void main(String[] args) {
        int[] weights = {2, 3, 4, 5};
        int[] values = {3, 4, 5, 6};
        int maxVal = knapsackWithItems(weights, values, 5);
        System.out.println("Max value: " + maxVal);
    }
}
