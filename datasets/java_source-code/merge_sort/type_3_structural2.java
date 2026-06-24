public class type_3_structural2
 {

    public static int[] mergeSort(int[] arr) {
        if (arr.length < 2) {
            return arr;
        }

        int half = arr.length / 2;

        int[] leftPart = new int[half];
        int[] rightPart = new int[arr.length - half];

        for (int i = 0; i < half; i++) {
            leftPart[i] = arr[i];
        }

        for (int i = half; i < arr.length; i++) {
            rightPart[i - half] = arr[i];
        }

        int[] leftSorted = mergeSort(leftPart);
        int[] rightSorted = mergeSort(rightPart);

        return merge(leftSorted, rightSorted);
    }

    public static int[] merge(int[] left, int[] right) {
        int[] sortedList = new int[left.length + right.length];

        int i = 0, j = 0, k = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                sortedList[k++] = left[i++];
            } else {
                sortedList[k++] = right[j++];
            }
        }

        while (i < left.length) {
            sortedList[k++] = left[i++];
        }

        while (j < right.length) {
            sortedList[k++] = right[j++];
        }

        return sortedList;
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};

        int[] result = mergeSort(arr);

        for (int v : result) {
            System.out.print(v + " ");
        }
    }
}