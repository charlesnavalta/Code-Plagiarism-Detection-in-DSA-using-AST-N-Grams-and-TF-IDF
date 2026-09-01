public class Solution {
    private int[] mergeBlocks(int[] leftArr, int[] rightArr) {
        int[] out = new int[leftArr.length + rightArr.length];
        int i = 0, j = 0, k = 0;
        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) out[k++] = leftArr[i++];
            else out[k++] = rightArr[j++];
        }
        while (i < leftArr.length) out[k++] = leftArr[i++];
        while (j < rightArr.length) out[k++] = rightArr[j++];
        return out;
    }

    public int[] mergeSort(int[] arr) {
        if (arr == null || arr.length <= 1) return arr;
        int mid = arr.length / 2;
        int[] leftPart = new int[mid];
        int[] rightPart = new int[arr.length - mid];
        System.arraycopy(arr, 0, leftPart, 0, mid);
        System.arraycopy(arr, mid, rightPart, 0, arr.length - mid);
        
        rightPart = mergeSort(rightPart);
        leftPart = mergeSort(leftPart);
        return mergeBlocks(leftPart, rightPart);
    }
}
