import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		try (Scanner sc = new Scanner(System.in)) {
			int n, a, b;
			n = sc.nextInt();
			a = sc.nextInt();
			b = sc.nextInt();
			
			int total = n * a;
			
			System.out.println(Math.min(total, b));
			
		} catch (Exception e) {
			// TODO: handle exception
		}

	}

}
