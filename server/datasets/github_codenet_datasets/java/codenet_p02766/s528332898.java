import java.util.Scanner;
public class Main{
    public static void main(String args[]){
        Scanner scan = new Scanner(System.in);
        int a = scan.nextInt();
        int b = scan.nextInt();
        int i = 0;
        while(a > 0){
            a = a / b;
            i++;
        }
        System.out.println(i);

    }
}