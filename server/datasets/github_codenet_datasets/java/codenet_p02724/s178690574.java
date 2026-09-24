import java.util.*;
 
public class Main{
  public static void main(String[] args){
    Scanner sc = new Scanner(System.in);
    long X = sc.nextLong();
    long ans = 0;
    while(X>=500){
      ans += 1000;
      X -= 500;
    }
    while(X>=5){
      ans += 5;
      X -= 5;
    }
    System.out.println(ans);
  }
}