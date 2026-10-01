import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public int findClosest(int[] d, boolean[] vis, int n) {
        int minD = Integer.MAX_VALUE;
        int minV = -1;
        int i = 0;
        while (i < n) {
            if (!vis[i] && d[i] <= minD) {
                minD = d[i];
                minV = i;
            }
            i++;
        }
        return minV;
    }

    public int[] findShortestDistances(int[][] graphMatrix, int sourceVertex) {
        int totalVertices = graphMatrix.length;
        int[] minDistance = new int[totalVertices];
        boolean[] processedSet = new boolean[totalVertices];
        Arrays.fill(minDistance, Integer.MAX_VALUE);
        minDistance[sourceVertex] = 0;

        for (int count = 0; count < totalVertices - 1; count++) {
            int u = findClosest(minDistance, processedSet, totalVertices);
            if (u == -1) break;
            processedSet[u] = true;
            int v = 0;
            while (v < totalVertices) {
                if (!processedSet[v] && graphMatrix[u][v] != 0 && minDistance[u] != Integer.MAX_VALUE) {
                    if (minDistance[u] + graphMatrix[u][v] < minDistance[v]) {
                        minDistance[v] = minDistance[u] + graphMatrix[u][v];
                    }
                }
                v++;
            }
        }
        return minDistance;
    }
}
