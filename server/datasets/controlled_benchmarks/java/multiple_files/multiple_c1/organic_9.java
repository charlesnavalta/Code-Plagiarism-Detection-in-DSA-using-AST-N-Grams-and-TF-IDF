/*
 * Graph BFS - Organic Submission #9
 * Functional-style implementation with explicit typed collections.
 */

import java.util.*;

class Solution {
    public static List<String> bfsTraversal(Map<String, List<String>> graph, String source) {
        Queue<String> frontier = new ArrayDeque<>();
        Set<String> explored = new HashSet<>();
        List<String> sequence = new ArrayList<>();

        frontier.add(source);
        explored.add(source);

        while (!frontier.isEmpty()) {
            String vertex = frontier.poll();
            sequence.add(vertex);

            List<String> neighbours = graph.getOrDefault(vertex, Collections.emptyList());
            for (String neighbour : neighbours) {
                if (!explored.contains(neighbour)) {
                    explored.add(neighbour);
                    frontier.add(neighbour);
                }
            }
        }
        return sequence;
    }

    public static void main(String[] args) {
        Map<String, List<String>> sampleGraph = new HashMap<>();
        sampleGraph.put("S", Arrays.asList("A", "B"));
        sampleGraph.put("A", Arrays.asList("S", "C"));
        sampleGraph.put("B", Arrays.asList("S", "C", "D"));
        sampleGraph.put("C", Arrays.asList("A", "B", "D"));
        sampleGraph.put("D", Arrays.asList("B", "C"));

        System.out.println(bfsTraversal(sampleGraph, "S"));
    }
}
