import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public int selectMinVertex(int[] minDistance, boolean[] processedSet, int totalVertices) {
        int minVal = Integer.MAX_VALUE;
        int minIdx = -1;
        for (int v = 0; v < totalVertices; v++) {
            if (!processedSet[v] && minDistance[v] <= minVal) {
                minVal = minDistance[v];
                minIdx = v;
            }
        }
        return minIdx;
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
        int count = 0;
        while (count < totalVertices - 1) {
            int u = selectMinVertex(minDistance, processedSet, totalVertices);
            if (u == -1) break;
            processedSet[u] = true;
            for (int v = 0; v < totalVertices; v++) {
                if (!processedSet[v] && graphMatrix[u][v] != 0 && minDistance[u] != Integer.MAX_VALUE && minDistance[u] + graphMatrix[u][v] < minDistance[v]) {
                    minDistance[v] = minDistance[u] + graphMatrix[u][v];
                }
            }
            count++;
        }
        return minDistance;
    }
}
