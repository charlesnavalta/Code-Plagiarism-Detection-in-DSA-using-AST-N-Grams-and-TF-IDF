import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public void relaxEdges(int[][] matrix, int[] dist, boolean[] visited, int u, int n) {
        for (int v = 0; v < n; v++) {
            int weight = matrix[u][v];
            if (!visited[v] && weight != 0 && dist[u] != Integer.MAX_VALUE) {
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                }
            }
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
            int minVal = Integer.MAX_VALUE, u = -1;
            for (int v = 0; v < totalVertices; v++) {
                if (!processedSet[v] && minDistance[v] <= minVal) {
                    minVal = minDistance[v];
                    u = v;
                }
            }
            if (u == -1) break;
            processedSet[u] = true;
            relaxEdges(graphMatrix, minDistance, processedSet, u, totalVertices);
        }
        return minDistance;
    }
}
