public class type_2_renamed {

    public static int[] mergeSort(int[] arr) {
        if (arr.length <= 1) {
            return arr;
        }

        int midIndex = arr.length / 2;

        int[] left = new int[midIndex];
        int[] right = new int[arr.length - midIndex];

        for (int i = 0; i < midIndex; i++) {
            left[i] = arr[i];
        }

        for (int i = midIndex; i < arr.length; i++) {
            right[i - midIndex] = arr[i];
        }

        int[] leftSorted = mergeSort(left);
        int[] rightSorted = mergeSort(right);

        return mergeLists(leftSorted, rightSorted);
    }

    public static int[] mergeLists(int[] list1, int[] list2) {
        int[] result = new int[list1.length + list2.length];

        int p1 = 0, p2 = 0, k = 0;

        while (p1 < list1.length) {
            if (p2 >= list2.length || list1[p1] < list2[p2]) {
                result[k++] = list1[p1++];
            } else {
                result[k++] = list2[p2++];
            }
        }

        while (p2 < list2.length) {
            result[k++] = list2[p2++];
        }

        return result;
    }

    public static void main(String[] args) {
        int[] data = {38, 27, 43, 3, 9, 82, 10};

        int[] sorted = mergeSort(data);

        for (int num : sorted) {
            System.out.print(num + " ");
        }
    }
}