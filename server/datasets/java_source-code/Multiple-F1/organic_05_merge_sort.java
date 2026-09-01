import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<Integer> sortArray(List<Integer> data) {
        if (data == null || data.size() < 2) return data;
        int m = data.size() / 2;
        List<Integer> left = sortArray(new ArrayList<>(data.subList(0, m)));
        List<Integer> right = sortArray(new ArrayList<>(data.subList(m, data.size())));
        return combine(left, right);
    }

    private List<Integer> combine(List<Integer> a, List<Integer> b) {
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < a.size() && j < b.size()) {
            if (a.get(i) < b.get(j)) res.add(a.get(i++));
            else res.add(b.get(j++));
        }
        while (i < a.size()) res.add(a.get(i++));
        while (j < b.size()) res.add(b.get(j++));
        return res;
    }
}
