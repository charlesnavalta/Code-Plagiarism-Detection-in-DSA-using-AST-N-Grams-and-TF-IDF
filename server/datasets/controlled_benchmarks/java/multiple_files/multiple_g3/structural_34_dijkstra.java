import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
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
            int v = 0;
            while (v < totalVertices) {
                if (!processedSet[v] && minDistance[v] <= currentMin) {
                    currentMin = minDistance[v];
                    u = v;
                }
                v++;
            }
            if (u == -1) break;
            processedSet[u] = true;
            for (int target = 0; target < totalVertices; target++) {
                if (!processedSet[target] && graphMatrix[u][target] != 0 && minDistance[u] != Integer.MAX_VALUE) {
                    int alt = minDistance[u] + graphMatrix[u][target];
                    if (alt < minDistance[target]) {
                        minDistance[target] = alt;
                    }
                }
            }
        }
        return minDistance;
    }
}
