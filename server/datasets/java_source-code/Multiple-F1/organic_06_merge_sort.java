import java.util.Arrays;

public class Solution {
    public int[] mergeSort(int[] dataList) {
        if (dataList == null || dataList.length <= 1) return dataList;
        int n = dataList.length;
        for (int step = 1; step < n; step *= 2) {
            for (int offset = 0; offset < n; offset += 2 * step) {
                int mid = Math.min(offset + step, n);
                int end = Math.min(offset + 2 * step, n);
                if (mid >= end) break;
                int[] l = Arrays.copyOfRange(dataList, offset, mid);
                int[] r = Arrays.copyOfRange(dataList, mid, end);
                int i = 0, j = 0, k = offset;
                while (i < l.length && j < r.length) {
                    if (l[i] <= r[j]) dataList[k++] = l[i++];
                    else dataList[k++] = r[j++];
                }
                while (i < l.length) dataList[k++] = l[i++];
                while (j < r.length) dataList[k++] = r[j++];
            }
        }
        return dataList;
    }
}
