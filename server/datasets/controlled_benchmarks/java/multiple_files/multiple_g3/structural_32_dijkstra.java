import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public int[] findShortestDistances(int[][] graphMatrix, int sourceVertex) {
        int V = graphMatrix.length;
        int[] dist = new int[V];
        boolean[] sptSet = new boolean[V];
        for (int i = 0; i < V; i++) {
            dist[i] = Integer.MAX_VALUE;
            sptSet[i] = false;
        }
        dist[sourceVertex] = 0;

        int count = 0;
        while (count < V - 1) {
            int u = -1, min = Integer.MAX_VALUE;
            for (int v = 0; v < V; v++) {
                if (!sptSet[v] && dist[v] <= min) {
                    min = dist[v];
                    u = v;
                }
            }
            if (u == -1) break;
            sptSet[u] = true;
            for (int v = 0; v < V; v++) {
                int weight = graphMatrix[u][v];
                if (!sptSet[v] && weight != 0 && dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                }
            }
            count++;
        }
        return dist;
    }
}
