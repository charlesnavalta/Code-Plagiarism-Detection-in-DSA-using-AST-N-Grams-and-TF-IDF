/*
 * Graph BFS - Organic Submission #1
 * Basic breadth-first traversal using a queue and adjacency list.
 */

import java.util.*;

class Solution {
    public static List<String> bfs(Map<String, List<String>> graph, String start) {
        Set<String> visited = new HashSet<>();
        List<String> order = new ArrayList<>();
        Queue<String> queue = new ArrayDeque<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            String node = queue.poll();
            order.add(node);

            List<String> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D", "E"));
        graph.put("C", Arrays.asList("A", "F"));
        graph.put("D", Arrays.asList("B"));
        graph.put("E", Arrays.asList("B", "F"));
        graph.put("F", Arrays.asList("C", "E"));

        List<String> result = bfs(graph, "A");
        System.out.println("BFS order: " + result);
    }
}
