import java.util.ArrayList;

public class Main {

    public static ArrayList<Integer> quickSort(ArrayList<Integer> arr) {
        if (arr.size() <= 1) {
            return arr;
        }

        int pivot = arr.get(arr.size() - 1);

        ArrayList<Integer> left = new ArrayList<>();
        ArrayList<Integer> right = new ArrayList<>();

        for (int i = 0; i < arr.size() - 1; i++) {
            if (arr.get(i) <= pivot) {
                left.add(arr.get(i));
            } else {
                right.add(arr.get(i));
            }
        }

        ArrayList<Integer> sorted = new ArrayList<>();
        sorted.addAll(quickSort(left));
        sorted.add(pivot);
        sorted.addAll(quickSort(right));

        return sorted;
    }

    public static void main(String[] args) {
        ArrayList<Integer> data = new ArrayList<>();

        int[] values = {10, 7, 8, 9, 1, 5};
        for (int v : values) {
            data.add(v);
        }

        ArrayList<Integer> result = quickSort(data);

        for (int num : result) {
            System.out.print(num + " ");
        }
    }
}