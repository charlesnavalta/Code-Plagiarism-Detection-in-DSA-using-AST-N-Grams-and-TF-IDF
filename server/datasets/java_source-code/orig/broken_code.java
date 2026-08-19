public class Main {

    public static int calculateSum(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(calculateSum(5, 10));
    }
}