import java.util.*;
public class Main {
  public static void main (String[] args) {
    Scanner sc = new Scanner(System.in);
    int N = sc.nextInt();
    int num = N/500;
    int ans = 1000*(num) +(N-500*(num))/5*5;
    System.out.println(ans);
  }
}