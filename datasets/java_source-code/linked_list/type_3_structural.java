public class Main {
    public static boolean linearSearch(int[] arr, int target) {
        int index = 0;
        boolean found = false;

        while (index < arr.length && !found) {
            if (arr[index] == target) {
                found = true;
            }
            index++;
        }

        return found;
    }

    public static void main(String[] args) {
        int[] nums = {3, 7, 1, 9, 5};
        System.out.println(linearSearch(nums, 9));
    }
}