import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        int a = sc.nextInt();

        int sumTaxi = sc.nextInt();

        int sumTrain = n * a;

        if (sumTaxi < sumTrain) {
            System.out.println(sumTaxi);
        } else {
            System.out.println(sumTrain);
        }

    }
}
