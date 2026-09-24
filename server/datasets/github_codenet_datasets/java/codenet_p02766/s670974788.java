import java.util.*;

public class Main{
  public static void main(String[] args){
    Scanner sc = new Scanner(System.in);
  	long n,k,r=0;
    n=sc.nextLong();
    k=sc.nextLong();
    while((n/(int)Math.pow(k,r))>0){
      r++;
    }
    System.out.print(r);
  }
}