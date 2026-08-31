/*
 * Quick Sort - Organic Submission #22
 * Individual student implementation #22 with custom coding conventions.
 */

class Solution22 {
    public static int splitSegment22(int[] dataArray, int startBound, int endBound) {
        int pivotRef = dataArray[endBound];
        int partitionIdx = startBound - 1;
        for (int scanPtr = startBound; scanPtr < endBound; scanPtr++) {
            if (dataArray[scanPtr] <= pivotRef) {
                partitionIdx++;
                int hold = dataArray[partitionIdx];
                dataArray[partitionIdx] = dataArray[scanPtr];
                dataArray[scanPtr] = hold;
            }
        }
        int hold = dataArray[partitionIdx + 1];
        dataArray[partitionIdx + 1] = dataArray[endBound];
        dataArray[endBound] = hold;
        return partitionIdx + 1;
    }

    public static void performQuicksort22(int[] dataArray, int startBound, int endBound) {
        if (startBound < endBound) {
            int splitLoc = splitSegment22(dataArray, startBound, endBound);
            performQuicksort22(dataArray, startBound, splitLoc - 1);
            performQuicksort22(dataArray, splitLoc + 1, endBound);
        }
    }

    public static void main(String[] args) {
        int[] sample = {4, 16, 42, 14, 28, 42};
        performQuicksort22(sample, 0, sample.length - 1);
        System.out.println(java.util.Arrays.toString(sample));
    }
}
