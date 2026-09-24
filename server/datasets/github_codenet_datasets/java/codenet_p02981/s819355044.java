import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = Integer.parseInt(sc.next());
        int A = Integer.parseInt(sc.next());
        int B = Integer.parseInt(sc.next());

        int sumA = A * N;
        
        System.out.println((sumA >= B ? B : sumA)); 

        sc.close();
    }
    
}