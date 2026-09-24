/*
 * Binary Search - Submission by Isabelle
 * Approach: Defensive, fully type-hinted implementation that returns a
 * small SearchResult object (index + comparison count) instead of a
 * bare int, and validates that the input is actually sorted first.
 * This is the "unique" baseline for this scenario.
 */

class SearchResult {
    Integer index;
    int comparisons;

    public SearchResult(Integer index, int comparisons) {
        this.index = index;
        this.comparisons = comparisons;
    }

    public boolean isFound() {
        return this.index != null;
    }
}

class BinarySearch {
    public static boolean isSorted(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    public static SearchResult binarySearch(int[] arr, int target) {
        if (!isSorted(arr)) {
            throw new IllegalArgumentException("binary_search requires a sorted list");
        }

        int lo = 0;
        int hi = arr.length - 1;
        int comparisons = 0;

        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            comparisons++;

            if (arr[mid] == target) {
                return new SearchResult(mid, comparisons);
            } else if (arr[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }

        return new SearchResult(null, comparisons);
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;

        SearchResult result = binarySearch(arr, target);
        if (result.isFound()) {
            System.out.println("Found " + target + " at index " + result.index + " (" + result.comparisons + " comparisons)");
        } else {
            System.out.println(target + " not found (" + result.comparisons + " comparisons)");
        }
    }
}
