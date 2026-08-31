/*
 * Graph BFS - Organic Submission #2
 * Uses a plain ArrayList as the queue (remove(0)) instead of ArrayDeque.
 */

import java.util.*;

class Solution {
    public static Map<String, List<String>> buildGraph(String[][] edges) {
        Map<String, List<String>> graph = new HashMap<>();
        for (String[] edge : edges) {
            String u = edge[0];
            String v = edge[1];
            graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            graph.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
        }
        return graph;
    }

    public static List<String> breadthFirstSearch(Map<String, List<String>> graph, String startNode) {
        Set<String> seen = new HashSet<>();
        List<String> queue = new ArrayList<>();
        List<String> traversal = new ArrayList<>();

        seen.add(startNode);
        queue.add(startNode);

        while (!queue.isEmpty()) {
            String current = queue.remove(0);
            traversal.add(current);

            List<String> adjs = graph.getOrDefault(current, Collections.emptyList());
            for (String adj : adjs) {
                if (!seen.contains(adj)) {
                    seen.add(adj);
                    queue.add(adj);
                }
            }
        }
        return traversal;
    }

    public static void main(String[] args) {
        String[][] edges = {
            {"A", "B"}, {"A", "C"}, {"B", "D"}, {"B", "E"}, {"C", "F"}, {"E", "F"}
        };
        Map<String, List<String>> g = buildGraph(edges);
        System.out.println(breadthFirstSearch(g, "A"));
    }
}
