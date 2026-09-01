import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
    public int[] mergeSort(int[] arr) {
        if (arr == null || arr.length <= 1) return arr;
        int mid = arr.length / 2;
        int[] l = mergeSort(Arrays.copyOfRange(arr, 0, mid));
        int[] r = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
        
        List<Integer> listL = new ArrayList<>();
        List<Integer> listR = new ArrayList<>();
        for (int x : l) listL.add(x);
        for (int x : r) listR.add(x);
        
        int[] res = new int[arr.length];
        int idx = 0;
        while (!listL.isEmpty() && !listR.isEmpty()) {
            if (listL.get(0) <= listR.get(0)) res[idx++] = listL.remove(0);
            else res[idx++] = listR.remove(0);
        }
        while (!listL.isEmpty()) res[idx++] = listL.remove(0);
        while (!listR.isEmpty()) res[idx++] = listR.remove(0);
        return res;
    }
}
