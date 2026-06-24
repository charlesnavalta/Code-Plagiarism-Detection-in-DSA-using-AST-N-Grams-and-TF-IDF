public class original {
    
    public static boolean linearSearch(int[] arr, int target) {
        for (int num : arr) {
            if (num == target) {
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