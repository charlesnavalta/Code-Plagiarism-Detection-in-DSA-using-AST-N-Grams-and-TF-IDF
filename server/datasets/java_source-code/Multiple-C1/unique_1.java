/*
 * Graph BFS - Unique Submission
 * Distinct approach: BFS iterator returning nodes one by one.
 */

import java.util.*;

class Solution {
    public static List<String> bfsGenerator(Map<String, List<String>> graph, String start) {
        Set<String> seen = new HashSet<>();
        Queue<String> q = new ArrayDeque<>();
        List<String> result = new ArrayList<>();

        seen.add(start);
        q.add(start);

        while (!q.isEmpty()) {
            String node = q.poll();
            result.add(node);
            List<String> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (String nxt : neighbors) {
                if (!seen.contains(nxt)) {
                    seen.add(nxt);
                    q.add(nxt);
                }
            }
        }
        return result;
    }

    public static List<String> takeUntil(List<String> traversal, String stopNode) {
        List<String> collected = new ArrayList<>();
        for (String node : traversal) {
            collected.add(node);
            if (node.equals(stopNode)) {
                break;
            }
        }
        return collected;
    }

    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("root", Arrays.asList("left", "right"));
        graph.put("left", Arrays.asList("root", "left.left"));
        graph.put("right", Arrays.asList("root", "right.right"));
        graph.put("left.left", Arrays.asList("left"));
        graph.put("right.right", Arrays.asList("right"));

        List<String> full = bfsGenerator(graph, "root");
        System.out.println("Full lazy traversal: " + full);
        System.out.println("Stopping early at 'right': " + takeUntil(full, "right"));
    }
}
