import java.util.*;
public class GraphTraversalService {
    public static void main(String[] args) {
        GraphTraversalService g = new GraphTraversalService();
        Map<Integer, List<Integer>> adj = new HashMap<>();
        adj.put(1, Arrays.asList(2, 3));
        g.bfs(adj, 1);
    }
    public List<Integer> bfs(Map<Integer, List<Integer>> adj, int start) {
        List<Integer> order = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        visited.add(start);
        queue.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int neighbor : adj.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return order;
    }
}