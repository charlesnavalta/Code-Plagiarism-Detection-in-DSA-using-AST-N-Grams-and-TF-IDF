/*
 * Graph BFS - Organic Submission #3
 * Level-order BFS that also records distance of each node from the source.
 */

import java.util.*;

class Solution {
    public static List<String> bfsWithLevels(Map<Integer, List<Integer>> graph, int source) {
        Map<Integer, Integer> distance = new HashMap<>();
        Queue<Integer> queue = new ArrayDeque<>();
        List<String> order = new ArrayList<>();

        distance.put(source, 0);
        queue.add(source);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node + ":" + distance.get(node));

            List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (int neighbor : neighbors) {
                if (!distance.containsKey(neighbor)) {
                    distance.put(neighbor, distance.get(node) + 1);
                    queue.add(neighbor);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(1, Arrays.asList(2, 3));
        graph.put(2, Arrays.asList(1, 4));
        graph.put(3, Arrays.asList(1, 4, 5));
        graph.put(4, Arrays.asList(2, 3, 6));
        graph.put(5, Arrays.asList(3, 6));
        graph.put(6, Arrays.asList(4, 5));

        List<String> res = bfsWithLevels(graph, 1);
        for (String item : res) {
            String[] parts = item.split(":");
            System.out.println("Node " + parts[0] + " -> level " + parts[1]);
        }
    }
}
