import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        int X = Integer.parseInt(scan.next());
        scan.close();
        
        int happy = 0;

        int a = X/500;
        int b = (X%500)/5;

        happy += 1000*a + 5*b;
        
        System.out.println(happy);
        // System.out.println(a);
        // System.out.println(b);
    }
}