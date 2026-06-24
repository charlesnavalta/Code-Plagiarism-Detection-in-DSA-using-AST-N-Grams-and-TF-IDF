public class type_1_exact {

    public static boolean linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[] nums = {3, 7, 1, 9, 5};
        System.out.println(linearSearch(nums, 9));
    }
}