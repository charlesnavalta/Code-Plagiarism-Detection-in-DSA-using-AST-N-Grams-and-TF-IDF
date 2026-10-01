import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public void updateDistances(int[][] g, int[] d, boolean[] vis, int u, int n) {
        int v = 0;
        while (v < n) {
            if (!vis[v] && g[u][v] != 0 && d[u] != Integer.MAX_VALUE && d[u] + g[u][v] < d[v]) {
                d[v] = d[u] + g[u][v];
            }
            v++;
        }
    }

    public int[] findShortestDistances(int[][] graphMatrix, int sourceVertex) {
        int totalVertices = graphMatrix.length;
        int[] minDistance = new int[totalVertices];
        boolean[] processedSet = new boolean[totalVertices];
        for (int i = 0; i < totalVertices; i++) {
            minDistance[i] = Integer.MAX_VALUE;
            processedSet[i] = false;
        }
        minDistance[sourceVertex] = 0;
        for (int count = 0; count < totalVertices - 1; count++) {
            int u = -1, currentMin = Integer.MAX_VALUE;
            for (int v = 0; v < totalVertices; v++) {
                if (!processedSet[v] && minDistance[v] <= currentMin) {
                    currentMin = minDistance[v];
                    u = v;
                }
            }
            if (u == -1) break;
            processedSet[u] = true;
            updateDistances(graphMatrix, minDistance, processedSet, u, totalVertices);
        }
        return minDistance;
    }
}
