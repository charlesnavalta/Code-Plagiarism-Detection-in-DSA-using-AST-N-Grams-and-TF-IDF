import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		long n = Long.parseLong(sc.next());
		int happiness = 0;

		happiness += n / 500 * 1000;
		n = n % 500;

		happiness += n / 5 * 5;

		System.out.println(happiness);

	}

}
