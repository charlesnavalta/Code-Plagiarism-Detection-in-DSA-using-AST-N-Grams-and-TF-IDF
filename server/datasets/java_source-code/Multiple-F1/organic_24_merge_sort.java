// Organic MergeSort Student Submission 24
import java.util.LinkedList;
import java.util.Queue;
public class QueueMergeSort {
    public static int[] sortQueue(int[] data) {
        if (data == null || data.length <= 1) return data;
        Queue<int[]> q = new LinkedList<>();
        for (int x : data) q.add(new int[]{x});
        while (q.size() > 1) {
            int[] a = q.poll();
            int[] b = q.poll();
            int[] res = new int[a.length + b.length];
            int i = 0, j = 0, k = 0;
            while (i < a.length && j < b.length) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
            while (i < a.length) res[k++] = a[i++];
            while (j < b.length) res[k++] = b[j++];
            q.add(res);
        }
        return q.poll();
    }
}
