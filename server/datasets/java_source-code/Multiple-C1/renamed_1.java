/*
 * Graph BFS - Renamed Submission
 * Same logic as organic_2.java, but every identifier has been renamed:
 * buildGraph -> constructAdjacencyMap, breadthFirstSearch -> traverseBfs,
 * seen -> discovered, queue -> pendingNodes, traversal -> visitationOrder.
 */

import java.util.*;

class Solution {
    public static Map<String, List<String>> constructAdjacencyMap(String[][] edgePairs) {
        Map<String, List<String>> adjacencyMap = new HashMap<>();
        for (String[] pair : edgePairs) {
            String sourceNode = pair[0];
            String destNode = pair[1];
            adjacencyMap.computeIfAbsent(sourceNode, k -> new ArrayList<>()).add(destNode);
            adjacencyMap.computeIfAbsent(destNode, k -> new ArrayList<>()).add(sourceNode);
        }
        return adjacencyMap;
    }

    public static List<String> traverseBfs(Map<String, List<String>> adjacencyMap, String origin) {
        Set<String> discovered = new HashSet<>();
        List<String> pendingNodes = new ArrayList<>();
        List<String> visitationOrder = new ArrayList<>();

        discovered.add(origin);
        pendingNodes.add(origin);

        while (!pendingNodes.isEmpty()) {
            String activeNode = pendingNodes.remove(0);
            visitationOrder.add(activeNode);

            List<String> links = adjacencyMap.getOrDefault(activeNode, Collections.emptyList());
            for (String linkedNode : links) {
                if (!discovered.contains(linkedNode)) {
                    discovered.add(linkedNode);
                    pendingNodes.add(linkedNode);
                }
            }
        }
        return visitationOrder;
    }

    public static void main(String[] args) {
        String[][] edgePairs = {
            {"A", "B"}, {"A", "C"}, {"B", "D"}, {"B", "E"}, {"C", "F"}, {"E", "F"}
        };
        Map<String, List<String>> adjacencyMap = constructAdjacencyMap(edgePairs);
        System.out.println(traverseBfs(adjacencyMap, "A"));
    }
}
