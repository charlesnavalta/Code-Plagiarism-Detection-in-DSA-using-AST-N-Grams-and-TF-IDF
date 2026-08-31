/*
 * Quick Sort - Organic Submission #15
 * Individual student implementation #15 with custom coding conventions.
 */

class Solution15 {
    public static int splitSegment15(int[] dataArray, int startBound, int endBound) {
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

    public static void performQuicksort15(int[] dataArray, int startBound, int endBound) {
        if (startBound < endBound) {
            int splitLoc = splitSegment15(dataArray, startBound, endBound);
            performQuicksort15(dataArray, startBound, splitLoc - 1);
            performQuicksort15(dataArray, splitLoc + 1, endBound);
        }
    }

    public static void main(String[] args) {
        int[] sample = {5, 45, 15, 14, 28, 42};
        performQuicksort15(sample, 0, sample.length - 1);
        System.out.println(java.util.Arrays.toString(sample));
    }
}
