/*
 * Quick Sort - Organic Submission #17
 * Individual student implementation #17 with custom coding conventions.
 */

class Solution17 {
    public static int splitSegment17(int[] dataArray, int startBound, int endBound) {
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

    public static void performQuicksort17(int[] dataArray, int startBound, int endBound) {
        if (startBound < endBound) {
            int splitLoc = splitSegment17(dataArray, startBound, endBound);
            performQuicksort17(dataArray, startBound, splitLoc - 1);
            performQuicksort17(dataArray, splitLoc + 1, endBound);
        }
    }

    public static void main(String[] args) {
        int[] sample = {19, 1, 37, 14, 28, 42};
        performQuicksort17(sample, 0, sample.length - 1);
        System.out.println(java.util.Arrays.toString(sample));
    }
}
