import java.util.*;

public class DijkstraAlgorithm {
    public static void main(String[] args) {
        DijkstraAlgorithm da = new DijkstraAlgorithm();
        int[][] g = {{0, 4}, {4, 0}};
        da.findShortestDistances(g, 0);
    }

    public int[] findShortestDistances(int[][] graphMatrix, int sourceVertex) {
        int V = graphMatrix.length;
        int[] distances = new int[V];
        boolean[] visited = new boolean[V];
        for (int i = 0; i < V; i++) distances[i] = Integer.MAX_VALUE;
        distances[sourceVertex] = 0;

        for (int iter = 0; iter < V - 1; iter++) {
            int bestNode = -1;
            int smallestDist = Integer.MAX_VALUE;
            for (int node = 0; node < V; node++) {
                if (!visited[node] && distances[node] <= smallestDist) {
                    smallestDist = distances[node];
                    bestNode = node;
                }
            }
            if (bestNode == -1) break;
            visited[bestNode] = true;
            for (int adj = 0; adj < V; adj++) {
                if (graphMatrix[bestNode][adj] != 0 && !visited[adj]) {
                    if (distances[bestNode] != Integer.MAX_VALUE && distances[bestNode] + graphMatrix[bestNode][adj] < distances[adj]) {
                        distances[adj] = distances[bestNode] + graphMatrix[bestNode][adj];
                    }
                }
            }
        }
        return distances;
    }
}
