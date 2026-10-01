import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public int[] findShortestDistances(int[][] graphMatrix, int sourceVertex) {
        int n = graphMatrix.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[sourceVertex] = 0;

        for (int step = 0; step < n - 1; step++) {
            int u = -1;
            for (int i = 0; i < n; i++) {
                if (!visited[i] && (u == -1 || dist[i] < dist[u])) {
                    u = i;
                }
            }
            if (u == -1 || dist[u] == Integer.MAX_VALUE) break;
            visited[u] = true;
            for (int v = 0; v < n; v++) {
                if (!visited[v] && graphMatrix[u][v] > 0 && dist[u] + graphMatrix[u][v] < dist[v]) {
                    dist[v] = dist[u] + graphMatrix[u][v];
                }
            }
        }
        return dist;
    }
}
