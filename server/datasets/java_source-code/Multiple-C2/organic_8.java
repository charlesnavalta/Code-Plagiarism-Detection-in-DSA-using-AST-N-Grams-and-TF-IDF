/*
 * 0/1 Knapsack (DP) - Organic Submission #8
 * Functional style using Item object and 1D DP table.
 */

import java.util.ArrayList;
import java.util.List;

class Item {
    int weight;
    int value;

    public Item(int weight, int value) {
        this.weight = weight;
        this.value = value;
    }
}

class Solution {
    public static int maxValue(List<Item> items, int capacity) {
        int[] dp = new int[capacity + 1];

        for (Item item : items) {
            for (int cap = capacity; cap >= item.weight; cap--) {
                int candidate = dp[cap - item.weight] + item.value;
                if (candidate > dp[cap]) {
                    dp[cap] = candidate;
                }
            }
        }
        return dp[capacity];
    }

    public static void main(String[] args) {
        List<Item> items = new ArrayList<>();
        items.add(new Item(2, 3));
        items.add(new Item(3, 4));
        items.add(new Item(4, 5));
        items.add(new Item(5, 6));
        System.out.println(maxValue(items, 5));
    }
}
