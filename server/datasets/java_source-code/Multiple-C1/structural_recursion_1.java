/*
 * Graph BFS - Structural Change Submission (queue -> recursion)
 * Same algorithm and output as organic_3.java, but iterative while loop is
 * replaced with recursive function processing one level frontier per call.
 */

import java.util.*;

class Solution {
    public static List<String> bfsWithLevels(Map<Integer, List<Integer>> graph, int source) {
        Map<Integer, Integer> distance = new HashMap<>();
        List<String> order = new ArrayList<>();

        distance.put(source, 0);
        processFrontier(graph, Collections.singletonList(source), distance, order);
        return order;
    }

    private static void processFrontier(Map<Integer, List<Integer>> graph, List<Integer> frontier,
                                        Map<Integer, Integer> distance, List<String> order) {
        if (frontier.isEmpty()) {
            return;
        }

        List<Integer> nextFrontier = new ArrayList<>();
        for (int node : frontier) {
            order.add(node + ":" + distance.get(node));
            List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (int neighbor : neighbors) {
                if (!distance.containsKey(neighbor)) {
                    distance.put(neighbor, distance.get(node) + 1);
                    nextFrontier.add(neighbor);
                }
            }
        }

        processFrontier(graph, nextFrontier, distance, order);
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
