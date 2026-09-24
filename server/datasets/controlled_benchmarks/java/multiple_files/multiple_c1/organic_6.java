/*
 * Graph BFS - Organic Submission #6
 * Uses integer-indexed nodes (0..n-1) and a boolean visited array.
 */

import java.util.*;

class Solution {
    public static List<Integer> bfs(int numNodes, int[][] adjacencyList, int start) {
        boolean[] visited = new boolean[numNodes];
        List<Integer> order = new ArrayList<>();
        Queue<Integer> q = new ArrayDeque<>();

        visited[start] = true;
        q.add(start);

        while (!q.isEmpty()) {
            int node = q.poll();
            order.add(node);
            for (int nxt : adjacencyList[node]) {
                if (!visited[nxt]) {
                    visited[nxt] = true;
                    q.add(nxt);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        int n = 6;
        int[][] adj = {
            {1, 2},
            {0, 3, 4},
            {0, 5},
            {1},
            {1, 5},
            {2, 4}
        };
        System.out.println(bfs(n, adj, 0));
    }
}
