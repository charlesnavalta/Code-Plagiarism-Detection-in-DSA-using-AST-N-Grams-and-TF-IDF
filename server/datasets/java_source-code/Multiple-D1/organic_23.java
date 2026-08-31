/*
 * Quick Sort - Organic Submission #23
 * Individual student implementation #23 with custom coding conventions.
 */

class Solution23 {
    public static int splitSegment23(int[] dataArray, int startBound, int endBound) {
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

    public static void performQuicksort23(int[] dataArray, int startBound, int endBound) {
        if (startBound < endBound) {
            int splitLoc = splitSegment23(dataArray, startBound, endBound);
            performQuicksort23(dataArray, startBound, splitLoc - 1);
            performQuicksort23(dataArray, splitLoc + 1, endBound);
        }
    }

    public static void main(String[] args) {
        int[] sample = {11, 19, 3, 14, 28, 42};
        performQuicksort23(sample, 0, sample.length - 1);
        System.out.println(java.util.Arrays.toString(sample));
    }
}
