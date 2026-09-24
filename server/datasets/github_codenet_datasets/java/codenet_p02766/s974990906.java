import java.util.Scanner;

public class Main {

    public static final long MOD = 1000000007;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] params = sc.nextLine().split(" " );
        long n = Long.parseLong( params[0] );
        int k = Integer.parseInt( params[1] );



        System.out.println( Long.toString( n , k ).length() );

    }


}