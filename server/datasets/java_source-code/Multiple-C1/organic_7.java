/*
 * Graph BFS - Organic Submission #7
 * Runs BFS across every connected component so disconnected graphs are traversed.
 */

import java.util.*;

class Solution {
    public static List<String> bfsFrom(Map<String, List<String>> graph, String start, Set<String> visited) {
        Queue<String> queue = new ArrayDeque<>();
        visited.add(start);
        queue.add(start);
        List<String> component = new ArrayList<>();

        while (!queue.isEmpty()) {
            String node = queue.poll();
            component.add(node);
            List<String> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return component;
    }

    public static List<List<String>> bfsAllComponents(Map<String, List<String>> graph) {
        Set<String> visited = new HashSet<>();
        List<List<String>> components = new ArrayList<>();

        for (String node : graph.keySet()) {
            if (!visited.contains(node)) {
                components.add(bfsFrom(graph, node, visited));
            }
        }
        return components;
    }

    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B"));
        graph.put("B", Arrays.asList("A"));
        graph.put("C", Arrays.asList("D", "E"));
        graph.put("D", Arrays.asList("C"));
        graph.put("E", Arrays.asList("C"));
        graph.put("F", Collections.emptyList());

        System.out.println(bfsAllComponents(graph));
    }
}
