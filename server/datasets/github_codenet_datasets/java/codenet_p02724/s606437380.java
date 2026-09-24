import java.util.Scanner;
public class Main{
  public static void main (String args[]){
    Scanner sc = new Scanner(System.in);
    int x = sc.nextInt();
    System.out.print(Logic.run(x));
  }
}
class Logic{
  public static int run(int x){
    int joy = 0;
    joy += (x / 500) * 1000;
    x = x % 500;
    joy += (x / 5) * 5;
    return joy;
  }
}