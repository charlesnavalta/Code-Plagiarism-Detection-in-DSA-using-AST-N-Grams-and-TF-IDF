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
        int initIdx = 0;
        while (initIdx < totalVertices) {
            minDistance[initIdx] = Integer.MAX_VALUE;
            processedSet[initIdx] = false;
            initIdx++;
        }
        minDistance[sourceVertex] = 0;
        int count = 0;
        while (count < totalVertices - 1) {
            int u = -1;
            int currentMin = Integer.MAX_VALUE;
            for (int v = totalVertices - 1; v >= 0; v--) {
                if (!processedSet[v] && minDistance[v] <= currentMin) {
                    currentMin = minDistance[v];
                    u = v;
                }
            }
            if (u == -1) break;
            processedSet[u] = true;
            for (int v = 0; v < totalVertices; v++) {
                if (!processedSet[v] && graphMatrix[u][v] != 0 && minDistance[u] != Integer.MAX_VALUE) {
                    int newCost = minDistance[u] + graphMatrix[u][v];
                    if (newCost < minDistance[v]) {
                        minDistance[v] = newCost;
                    }
                }
            }
            count++;
        }
        return minDistance;
    }
}
