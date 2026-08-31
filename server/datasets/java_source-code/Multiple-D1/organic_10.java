/*
 * Quick Sort - Organic Submission #10
 * Encapsulated Object-Oriented QuickSorter class.
 */

class QuickSorter {
    private int[] data;

    public QuickSorter(int[] input) {
        this.data = input.clone();
    }

    private int partition(int low, int high) {
        int pivot = this.data[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (this.data[j] <= pivot) {
                i++;
                int temp = this.data[i];
                this.data[i] = this.data[j];
                this.data[j] = temp;
            }
        }
        int temp = this.data[i + 1];
        this.data[i + 1] = this.data[high];
        this.data[high] = temp;
        return i + 1;
    }

    private void sortHelper(int low, int high) {
        if (low < high) {
            int pi = partition(low, high);
            sortHelper(low, pi - 1);
            sortHelper(pi + 1, high);
        }
    }

    public int[] sort() {
        sortHelper(0, this.data.length - 1);
        return this.data;
    }

    public static void main(String[] args) {
        QuickSorter sorter = new QuickSorter(new int[]{5, 2, 9, 1, 7, 6, 3});
        System.out.println(java.util.Arrays.toString(sorter.sort()));
    }
}
