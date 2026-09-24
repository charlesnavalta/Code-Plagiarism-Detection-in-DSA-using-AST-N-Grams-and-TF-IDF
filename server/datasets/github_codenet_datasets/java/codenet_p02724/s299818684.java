import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        int input = sc.nextInt();

        int fivehundreds = input / 500;

        int fivehundredrem = input % 500;

        int fives = fivehundredrem / 5;

        System.out.println(fivehundreds * 1000 + fives * 5);
    }
}
