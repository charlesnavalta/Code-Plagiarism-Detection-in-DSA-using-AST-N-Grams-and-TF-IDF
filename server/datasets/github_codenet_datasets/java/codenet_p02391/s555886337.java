import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();

    System.out.println(getResult(a, b));
  }

  private static String getResult(int a, int b) {
    if (a == b) {
      return "a == b";
    } else if (a > b) {
      return "a > b";
    } else {
      return "a < b";
    }
  }
}