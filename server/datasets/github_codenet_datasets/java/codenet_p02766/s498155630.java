
import java.util.Scanner;


public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int n= input.nextInt();
        int k = input.nextInt();
        String t="";
        while(n> 0){
       t = t+n%k;
       n = n/k;
     }
        System.out.println(t.length());
    }
}
