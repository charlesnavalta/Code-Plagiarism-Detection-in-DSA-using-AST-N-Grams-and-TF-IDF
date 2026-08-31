/*
 * Quick Sort - Mixed Attack Submission #1
 * Derived from organic_6: renaming, dead code variables, condition rewriting.
 */

class Solution {
    public static int[] splitTripartite(int[] bufferList, int firstPos, int lastPos) {
        int marker = bufferList[firstPos];
        int boundaryLeft = firstPos;
        int boundaryRight = lastPos;
        int curr = firstPos + 1;
        int deadCounter = 0;

        while (curr <= boundaryRight) {
            deadCounter++;
            if (bufferList[curr] < marker) {
                int t = bufferList[boundaryLeft];
                bufferList[boundaryLeft] = bufferList[curr];
                bufferList[curr] = t;
                boundaryLeft++;
                curr++;
            } else if (bufferList[curr] > marker) {
                int t = bufferList[boundaryRight];
                bufferList[boundaryRight] = bufferList[curr];
                bufferList[curr] = t;
                boundaryRight--;
            } else {
                curr++;
            }
        }
        int unusedCheck = deadCounter * 0;
        return new int[]{boundaryLeft, boundaryRight};
    }

    public static void executeTripartiteSort(int[] bufferList, int firstPos, int lastPos) {
        if (firstPos < lastPos) {
            int[] bounds = splitTripartite(bufferList, firstPos, lastPos);
            executeTripartiteSort(bufferList, firstPos, bounds[0] - 1);
            executeTripartiteSort(bufferList, bounds[1] + 1, lastPos);
        }
    }

    public static void main(String[] args) {
        int[] dataPoints = {4, 2, 4, 4, 1, 3, 2, 4, 1};
        executeTripartiteSort(dataPoints, 0, dataPoints.length - 1);
        System.out.println(java.util.Arrays.toString(dataPoints));
    }
}
