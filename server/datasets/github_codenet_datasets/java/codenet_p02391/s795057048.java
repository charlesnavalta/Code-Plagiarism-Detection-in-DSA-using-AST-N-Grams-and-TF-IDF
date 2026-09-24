import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in);		

		int a = scan.nextInt();
		int b = scan.nextInt();

		String str = a == b ? "a == b" : a > b ? "a > b" : "a < b";
		
		System.out.println(str);
		
		scan.close();

	}

}