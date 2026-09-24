
import java.util.Scanner;

public class Main{
    public static void main(String[] args){

        Scanner scan = new Scanner(System.in);
        int n = scan.nextInt();
        int a = scan.nextInt();
        int b = scan.nextInt();
        int ans = n*a;
        if ( ans < b){
            System.out.println(ans);
        } else {
            System.out.println(b);
        }
    }
}
