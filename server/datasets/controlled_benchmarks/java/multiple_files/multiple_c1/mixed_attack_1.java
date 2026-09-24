/*
 * Graph BFS - Mixed Attack Submission
 * Derived from organic_4.java. Combines identifier renaming AND statement reordering
 * (helper function moved below main logic, loop body lines swapped).
 */

import java.util.*;

class Solution {
    public static List<Integer> bfsOverMatrix(int[][] adjMatrix, int originIndex) {
        int totalNodes = adjMatrix.length;
        boolean[] seenFlags = new boolean[totalNodes];
        List<Integer> traversalOrder = new ArrayList<>();
        Queue<Integer> pending = new ArrayDeque<>();

        seenFlags[originIndex] = true;
        pending.add(originIndex);

        while (!pending.isEmpty()) {
            int active = pending.poll();

            for (int targetIndex = 0; targetIndex < totalNodes; targetIndex++) {
                if (adjMatrix[active][targetIndex] == 1 && !seenFlags[targetIndex]) {
                    pending.add(targetIndex);
                    seenFlags[targetIndex] = true;
                }
            }

            traversalOrder.add(active);
        }
        return traversalOrder;
    }

    public static List<String> labelLookup(List<Integer> indices, String[] labels) {
        List<String> result = new ArrayList<>();
        for (int i : indices) {
            result.add(labels[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        String[] labels = {"A", "B", "C", "D", "E"};
        int[][] adjMatrix = {
            {0, 1, 1, 0, 0},
            {1, 0, 0, 1, 0},
            {1, 0, 0, 0, 1},
            {0, 1, 0, 0, 1},
            {0, 0, 1, 1, 0}
        };
        List<Integer> order = bfsOverMatrix(adjMatrix, 0);
        System.out.println(labelLookup(order, labels));
    }
}
