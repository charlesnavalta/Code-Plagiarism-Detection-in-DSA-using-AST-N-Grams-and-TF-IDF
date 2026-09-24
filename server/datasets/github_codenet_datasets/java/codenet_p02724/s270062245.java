import java.util.Scanner;

public class Main {
	public static void main(String[] args) {
		Scanner scn = new Scanner(System.in);
		int x = scn.nextInt();
		int item1 = x / 500;
		int ans = item1 * 1000;
		item1 = (x % 500) / 5;
		ans += item1 * 5;
		System.out.println(ans);
	}
}
