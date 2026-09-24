import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
public class Main {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();
		int k = sc.nextInt();
		List<Integer> list =new ArrayList<Integer>();
		do {
			list.add(n%k);
			n/=k;
		}while(n>0);
		System.out.println(list.size());
	}

}
