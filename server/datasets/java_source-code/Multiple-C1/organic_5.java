/*
 * Graph BFS - Organic Submission #5
 * Object-oriented Graph class exposing addEdge() and bfs() methods.
 */

import java.util.*;

class Graph {
    Map<String, List<String>> adjacency;

    public Graph() {
        this.adjacency = new HashMap<>();
    }

    public void addEdge(String u, String v) {
        this.adjacency.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        this.adjacency.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
    }

    public List<String> bfs(String start) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new ArrayDeque<>();
        List<String> path = new ArrayList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            String vertex = queue.poll();
            path.add(vertex);

            List<String> neighbors = this.adjacency.getOrDefault(vertex, Collections.emptyList());
            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return path;
    }

    public static void main(String[] args) {
        Graph g = new Graph();
        String[][] edges = {
            {"A", "B"}, {"A", "C"}, {"B", "D"}, {"C", "D"}, {"D", "E"}
        };
        for (String[] edge : edges) {
            g.addEdge(edge[0], edge[1]);
        }
        System.out.println(g.bfs("A"));
    }
}
