/*
 * Graph BFS - Organic Submission #8
 * Finds the shortest path between two nodes by tracking parents during BFS.
 */

import java.util.*;

class Solution {
    public static List<String> shortestPath(Map<String, List<String>> graph, String start, String target) {
        Map<String, String> parent = new HashMap<>();
        parent.put(start, null);
        Queue<String> queue = new ArrayDeque<>();
        queue.add(start);

        while (!queue.isEmpty()) {
            String node = queue.poll();
            if (node.equals(target)) {
                break;
            }
            List<String> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (String neighbor : neighbors) {
                if (!parent.containsKey(neighbor)) {
                    parent.put(neighbor, node);
                    queue.add(neighbor);
                }
            }
        }

        if (!parent.containsKey(target)) {
            return null;
        }

        List<String> path = new ArrayList<>();
        String step = target;
        while (step != null) {
            path.add(step);
            step = parent.get(step);
        }
        Collections.reverse(path);
        return path;
    }

    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D"));
        graph.put("C", Arrays.asList("A", "D"));
        graph.put("D", Arrays.asList("B", "C", "E"));
        graph.put("E", Arrays.asList("D"));

        System.out.println(shortestPath(graph, "A", "E"));
    }
}
