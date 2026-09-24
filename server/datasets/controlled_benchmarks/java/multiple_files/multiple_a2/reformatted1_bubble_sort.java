/*
 * Bubble Sort - reformatted1
 * Approach: Identical logic and identifier names to unique1 - only
 * whitespace, indentation, and statement grouping have changed.
 */
import java.util.Arrays;
class BubbleSorter {
    int[] data; int swaps; int passes;
    public BubbleSorter(int[] data) { this.data = Arrays.copyOf(data, data.length); this.swaps = 0; this.passes = 0; }
    public int[] sort() {
        int n = this.data.length;
        for (int i = 0; i < n - 1; i++) {
            this.passes++; boolean swappedThisPass = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (this.data[j] > this.data[j + 1]) {
                    int temp = this.data[j]; this.data[j] = this.data[j + 1]; this.data[j + 1] = temp;
                    this.swaps++; swappedThisPass = true;
                }
            }
            if (!swappedThisPass) { break; }
        }
        return this.data;
    }
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        BubbleSorter sorter = new BubbleSorter(arr);
        int[] result = sorter.sort();
        System.out.println("Sorted: " + Arrays.toString(result));
        System.out.println("Swaps: " + sorter.swaps + ", Passes: " + sorter.passes);
    }
}
