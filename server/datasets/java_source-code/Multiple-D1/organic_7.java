/*
 * Quick Sort - Organic Submission #7
 * Functional-style partitioned List Quick Sort.
 */

import java.util.*;

class Solution {
    public static List<Integer> quickSortList(List<Integer> list) {
        if (list.size() <= 1) return list;
        int pivot = list.get(list.size() / 2);
        List<Integer> left = new ArrayList<>();
        List<Integer> middle = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        for (int x : list) {
            if (x < pivot) left.add(x);
            else if (x == pivot) middle.add(x);
            else right.add(x);
        }

        List<Integer> result = new ArrayList<>();
        result.addAll(quickSortList(left));
        result.addAll(middle);
        result.addAll(quickSortList(right));
        return result;
    }

    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(33, 10, 55, 71, 29, 62);
        System.out.println(quickSortList(nums));
    }
}
