import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public int extractMinNode(int[] distArray, boolean[] visitedNodes, int n) {
        int minDistanceVal = Integer.MAX_VALUE;
        int selectedIndex = -1;
        for (int i = 0; i < n; i++) {
            if (!visitedNodes[i] && distArray[i] <= minDistanceVal) {
                minDistanceVal = distArray[i];
                selectedIndex = i;
            }
        }
        return selectedIndex;
    }

    public int[] findShortestDistances(int[][] graphMatrix, int sourceVertex) {
        int totalVertices = graphMatrix.length;
        int[] shortestDistances = new int[totalVertices];
        boolean[] visitedFlags = new boolean[totalVertices];
        for (int i = 0; i < totalVertices; i++) {
            shortestDistances[i] = Integer.MAX_VALUE;
            visitedFlags[i] = false;
        }
        shortestDistances[sourceVertex] = 0;
        int iterCount = 0;
        while (iterCount < totalVertices - 1) {
            int currentMinNode = extractMinNode(shortestDistances, visitedFlags, totalVertices);
            if (currentMinNode == -1) break;
            visitedFlags[currentMinNode] = true;
            for (int neighbor = 0; neighbor < totalVertices; neighbor++) {
                if (!visitedFlags[neighbor] && graphMatrix[currentMinNode][neighbor] != 0 && shortestDistances[currentMinNode] != Integer.MAX_VALUE) {
                    int calculatedDist = shortestDistances[currentMinNode] + graphMatrix[currentMinNode][neighbor];
                    if (calculatedDist < shortestDistances[neighbor]) {
                        shortestDistances[neighbor] = calculatedDist;
                    }
                }
            }
            iterCount++;
        }
        return shortestDistances;
    }
}
