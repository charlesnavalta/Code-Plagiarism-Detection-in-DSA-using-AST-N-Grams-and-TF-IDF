import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(new BufferedReader(new InputStreamReader(System.in)));
        int N = scanner.nextInt();
        int A = scanner.nextInt();
        int B = scanner.nextInt();
        System.out.println(Math.min(N*A,B));
    }
}