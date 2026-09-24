import java.util.Scanner;

public class Main {
	static Scanner sc = new Scanner(System.in);

	public static void main(String[] args) {
		int N=sc.nextInt(),K=sc.nextInt(),d=1;
		while(true) {
			if(N<K) break;
			N/=K;
			d++;
		}
		System.out.println(d);
	}
}
