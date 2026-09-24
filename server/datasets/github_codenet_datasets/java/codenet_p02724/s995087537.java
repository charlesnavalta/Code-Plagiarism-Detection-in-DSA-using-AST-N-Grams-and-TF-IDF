import java.util.Scanner;

public class Main {
	public static void main(String[] args){
		try(Scanner sc = new Scanner(System.in)) {
			
			int x = sc.nextInt();
			
			int fhCount = x / 500;
			
			int rest = x - fhCount * 500;
			int fCount = rest / 5;
			
			System.out.println(fhCount * 1000 + fCount * 5);
			
		}
	}

}