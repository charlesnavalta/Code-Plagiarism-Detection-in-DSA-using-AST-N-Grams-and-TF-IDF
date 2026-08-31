/*
 * Quick Sort - Renamed Submission #2
 * Derived from organic_3: renamed variables.
 */

class Solution {
    public static int splitFirst(int[] vec, int start, int finish) {
        int key = vec[start];
        int mark = start;
        for (int k = start + 1; k <= finish; k++) {
            if (vec[k] < key) {
                mark++;
                int hold = vec[mark];
                vec[mark] = vec[k];
                vec[k] = hold;
            }
        }
        int hold = vec[start];
        vec[start] = vec[mark];
        vec[mark] = hold;
        return mark;
    }

    public static void sortFirst(int[] vec, int start, int finish) {
        if (start < finish) {
            int pos = splitFirst(vec, start, finish);
            sortFirst(vec, start, pos - 1);
            sortFirst(vec, pos + 1, finish);
        }
    }

    public static void main(String[] args) {
        int[] elements = {38, 27, 43, 3, 9, 82, 10};
        sortFirst(elements, 0, elements.length - 1);
        System.out.println(java.util.Arrays.toString(elements));
    }
}
