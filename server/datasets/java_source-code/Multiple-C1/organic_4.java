/*
 * Graph BFS - Organic Submission #4
 * BFS over an adjacency matrix representation.
 */

import java.util.*;

class Solution {
    public static List<Integer> bfsMatrix(int[][] matrix, int startIndex) {
        int n = matrix.length;
        boolean[] visited = new boolean[n];
        visited[startIndex] = true;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(startIndex);
        List<Integer> result = new ArrayList<>();

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            result.add(curr);

            for (int neighborIndex = 0; neighborIndex < n; neighborIndex++) {
                if (matrix[curr][neighborIndex] == 1 && !visited[neighborIndex]) {
                    visited[neighborIndex] = true;
                    queue.add(neighborIndex);
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] adjMatrix = {
            {0, 1, 1, 0, 0},
            {1, 0, 0, 1, 0},
            {1, 0, 0, 0, 1},
            {0, 1, 0, 0, 1},
            {0, 0, 1, 1, 0}
        };
        String[] labels = {"A", "B", "C", "D", "E"};
        List<Integer> order = bfsMatrix(adjMatrix, 0);
        List<String> labeledOrder = new ArrayList<>();
        for (int idx : order) {
            labeledOrder.add(labels[idx]);
        }
        System.out.println(labeledOrder);
    }
}
