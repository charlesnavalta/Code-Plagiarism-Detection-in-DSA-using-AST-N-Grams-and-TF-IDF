public class type_2_renamed {

    public static boolean linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[] numbers = {3, 7, 1, 9, 5};
        System.out.println(linearSearch(numbers, 9));
    }
}