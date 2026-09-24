import java.util.*;
public class Main {
    public static void main(String args[]) {
		Scanner s = new Scanner(System.in);
		int N,K;
      	N = s.nextInt();
      	K = s.nextInt();
		
      findNumberOfDigits(N,K);

    }
  
  static void findNumberOfDigits(long n, int base) 
    { 
          
        // Calculating log using base changing 
        // property and then taking it  
        // floor and then adding 1. 
        int dig = (int)(	Math.floor( Math.log(n) / Math.log(base)	)  + 1);  
          
          
        // printing output 
        System.out.print(dig); 
    } 
  
}