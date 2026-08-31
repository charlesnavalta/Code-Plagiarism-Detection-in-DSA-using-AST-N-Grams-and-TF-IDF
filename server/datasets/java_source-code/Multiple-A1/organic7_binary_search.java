/*
 * Binary Search - Submission by Ramon
 * Approach: Object-oriented design - a Searcher class wraps the sorted
 * data and exposes a find() method.
 */

class Searcher {
    private int[] data;

    public Searcher(int[] data) {
        this.data = data;
    }

    public int find(int target) {
        int lo = 0;
        int hi = this.data.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            int value = this.data[mid];
            if (value == target) {
                return mid;
            } else if (value < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        Searcher searcher = new Searcher(arr);
        System.out.println("Class-based result: " + searcher.find(target));
    }
}
