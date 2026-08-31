/*
 * Quick Sort - Organic Submission #14
 * Individual student implementation #14 with custom coding conventions.
 */

class Solution14 {
    public static int splitSegment14(int[] dataArray, int startBound, int endBound) {
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

    public static void performQuicksort14(int[] dataArray, int startBound, int endBound) {
        if (startBound < endBound) {
            int splitLoc = splitSegment14(dataArray, startBound, endBound);
            performQuicksort14(dataArray, startBound, splitLoc - 1);
            performQuicksort14(dataArray, splitLoc + 1, endBound);
        }
    }

    public static void main(String[] args) {
        int[] sample = {48, 42, 4, 14, 28, 42};
        performQuicksort14(sample, 0, sample.length - 1);
        System.out.println(java.util.Arrays.toString(sample));
    }
}
