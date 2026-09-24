import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    int N = scanner.nextInt();
    int K = scanner.nextInt();
    int n = 0;
    while (N > 0) {
      n++;
      N /= K;
    }
    System.out.println(n);
  }
}
