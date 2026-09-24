import java.util.*;

public class Main {
  public static void main(String[] args ) throws Exception {
    Scanner sc = new Scanner(System.in);
    int num1 = sc.nextInt();
    int num2 = sc.nextInt();
    int num3 = sc.nextInt();
    int Train= num1*num2;
    if(Train>=num3){
      System.out.println(num3);
    }else{
      System.out.println(Train);
    }
  }
}