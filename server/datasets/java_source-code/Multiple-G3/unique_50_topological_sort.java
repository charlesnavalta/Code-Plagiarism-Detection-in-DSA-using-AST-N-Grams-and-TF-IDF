import java.util.*;
public class KahnTopologicalSort {
    public static void main(String[] args) {
        KahnTopologicalSort kts = new KahnTopologicalSort();
    }
    public int[] computeTopologicalOrder(int totalVertices, List<List<Integer>> adjacencyList) {
        int[] inDegreeCount = new int[totalVertices];
        for (int u = 0; u < totalVertices; u++) {
            for (int neighbor : adjacencyList.get(u)) {
                inDegreeCount[neighbor]++;
            }
        }
        Queue<Integer> zeroDegreeQueue = new LinkedList<>();
        for (int i = 0; i < totalVertices; i++) {
            if (inDegreeCount[i] == 0) zeroDegreeQueue.add(i);
        }
        int[] sortedOutput = new int[totalVertices];
        int writeIndex = 0;
        while (!zeroDegreeQueue.isEmpty()) {
            int current = zeroDegreeQueue.poll();
            sortedOutput[writeIndex++] = current;
            for (int neighbor : adjacencyList.get(current)) {
                inDegreeCount[neighbor]--;
                if (inDegreeCount[neighbor] == 0) zeroDegreeQueue.add(neighbor);
            }
        }
        return sortedOutput;
    }
}