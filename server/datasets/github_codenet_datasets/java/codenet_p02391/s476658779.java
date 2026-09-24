import java.util.Scanner;

class Main {
	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		int a = scanner.nextInt(), b = scanner.nextInt();
		String operator;

		if (a < b)
			operator = "<";
		else if (a > b)
			operator = ">";
		else
			operator = "==";

		System.out.println("a " + operator + " b");
	}
}