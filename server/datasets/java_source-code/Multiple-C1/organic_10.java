/*
 * Graph BFS - Organic Submission #10
 * Builds a graph from a raw edge list and returns a map of node to distance level.
 */

import java.util.*;

class Solution {
    public static Map<String, Set<String>> makeAdjacency(String[][] edgeList) {
        Map<String, Set<String>> adjacency = new HashMap<>();
        for (String[] edge : edgeList) {
            String a = edge[0];
            String b = edge[1];
            adjacency.computeIfAbsent(a, k -> new HashSet<>()).add(b);
            adjacency.computeIfAbsent(b, k -> new HashSet<>()).add(a);
        }
        return adjacency;
    }

    public static Map<String, Integer> levelsFromSource(Map<String, Set<String>> adjacency, String source) {
        Map<String, Integer> levels = new HashMap<>();
        Queue<String> pending = new ArrayDeque<>();

        levels.put(source, 0);
        pending.add(source);

        while (!pending.isEmpty()) {
            String current = pending.poll();
            int currentLevel = levels.get(current);

            Set<String> neighbors = adjacency.getOrDefault(current, Collections.emptySet());
            for (String nxt : neighbors) {
                if (!levels.containsKey(nxt)) {
                    levels.put(nxt, currentLevel + 1);
                    pending.add(nxt);
                }
            }
        }
        return levels;
    }

    public static void main(String[] args) {
        String[][] edges = {
            {"A", "B"}, {"A", "C"}, {"B", "D"},
            {"C", "D"}, {"D", "E"}, {"E", "F"}
        };
        Map<String, Set<String>> adjacency = makeAdjacency(edges);
        System.out.println(levelsFromSource(adjacency, "A"));
    }
}
