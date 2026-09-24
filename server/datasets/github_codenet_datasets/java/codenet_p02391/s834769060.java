import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int a = scan.nextInt();
        int b = scan.nextInt();

        int ans = Integer.compare(a, b);
        String out = ans == 1 ? "a > b" : "a < b";
        String aa = a == b ? "a == b" : out;
        System.out.println(aa);
    }
}