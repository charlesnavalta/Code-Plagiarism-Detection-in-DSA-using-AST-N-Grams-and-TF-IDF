public class Main {

    public static boolean linearSearch(int[] lst, int key) {
        for (int item : lst) {
            if (item == key) {
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