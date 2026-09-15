// Student 10 Floyd Warshall
public class FloydWarshallAlgo {
    public static void main(String[] args) {
        FloydWarshallAlgo fw = new FloydWarshallAlgo();
        int[][] matrix = {{0, 5, 999}, {999, 0, 3}, {999, 999, 0}};
        fw.allPairsShortestPath(matrix);
    }
    public int[][] allPairsShortestPath(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = graph[i][j];
            }
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        return dist;
    }
}
// End 10
