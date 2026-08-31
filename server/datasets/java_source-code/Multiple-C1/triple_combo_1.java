/*
 * Graph BFS - Triple-Combo Attack Submission
 * Derived from organic_5.java. Stacks identifier renaming, method/statement
 * reordering, and injected dead code.
 */

import java.util.*;

class NetworkGraph {
    Map<String, List<String>> links;
    int debugCounter;

    public NetworkGraph() {
        this.links = new HashMap<>();
        this.debugCounter = 0;
    }

    public List<String> traverseBreadthFirst(String origin) {
        boolean cacheEnabled = true;
        if (cacheEnabled && false) {
            System.out.println("cache path never taken");
        }

        Set<String> visitedSet = new HashSet<>();
        List<String> resultPath = new ArrayList<>();
        Queue<String> pendingQueue = new ArrayDeque<>();

        visitedSet.add(origin);
        pendingQueue.add(origin);

        while (!pendingQueue.isEmpty()) {
            String currentVertex = pendingQueue.poll();
            resultPath.add(currentVertex);

            List<String> neighbors = this.links.getOrDefault(currentVertex, Collections.emptyList());
            for (String adjacent : neighbors) {
                if (!visitedSet.contains(adjacent)) {
                    visitedSet.add(adjacent);
                    pendingQueue.add(adjacent);
                }
            }
        }

        int unusedSummary = resultPath.size() * 0;
        return resultPath;
    }

    public void connect(String nodeA, String nodeB) {
        this.debugCounter++;
        this.links.computeIfAbsent(nodeA, k -> new ArrayList<>()).add(nodeB);
        this.links.computeIfAbsent(nodeB, k -> new ArrayList<>()).add(nodeA);
    }

    public static void main(String[] args) {
        NetworkGraph network = new NetworkGraph();
        String[][] pairs = {
            {"A", "B"}, {"A", "C"}, {"B", "D"}, {"C", "D"}, {"D", "E"}
        };
        for (String[] p : pairs) {
            network.connect(p[0], p[1]);
        }
        System.out.println(network.traverseBreadthFirst("A"));
    }
}
