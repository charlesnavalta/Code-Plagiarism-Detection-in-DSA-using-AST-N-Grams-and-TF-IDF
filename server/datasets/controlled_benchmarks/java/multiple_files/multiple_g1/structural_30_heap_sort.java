public class Sorter_5 {
    public static void main(String[] args) {
        int[] elements = {12, 11, 13, 5, 6, 7};
        new Sorter_5().executeHeapSort(elements);
    }
    public int pickLargerChild(int[] elements, int bound, int left, int right) {
        if (right >= bound) return left;
        return elements[right] > elements[left] ? right : left;
    }
    public void maxHeapify(int[] elements, int bound, int root) {
        int left = 2 * root + 1;
        int right = 2 * root + 2;
        if (left >= bound) return;
        int bestChild = pickLargerChild(elements, bound, left, right);
        if (elements[bestChild] > elements[root]) {
            int tmp = elements[root];
            elements[root] = elements[bestChild];
            elements[bestChild] = tmp;
            maxHeapify(elements, bound, bestChild);
        }
    }
    public void executeHeapSort(int[] elements) {
        int n = elements.length;
        for (int k = n / 2 - 1; k >= 0; k--) {
            maxHeapify(elements, n, k);
        }
        for (int k = n - 1; k > 0; k--) {
            int tmp = elements[0];
            elements[0] = elements[k];
            elements[k] = tmp;
            maxHeapify(elements, k, 0);
        }
    }
}
