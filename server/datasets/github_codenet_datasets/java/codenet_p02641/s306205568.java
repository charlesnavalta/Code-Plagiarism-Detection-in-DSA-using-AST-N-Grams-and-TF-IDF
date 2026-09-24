import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int x = sc.nextInt();
		int n = sc.nextInt();
		List<Integer>p = new ArrayList<>();
		int a = 0;
		int min = 101;
		for(int i = 0; i < n; i++)
			p.add(sc.nextInt());
		for(int i = -1; i <= 200; i++){
			if(!p.contains(i) && Math.abs(i - x) < min){
				a = i;
				min = Math.abs(i - x);
			}
		}
		System.out.print(a);
	}
}
