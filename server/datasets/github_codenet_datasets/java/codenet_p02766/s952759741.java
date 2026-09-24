import java.util.Scanner;

public class Main {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int N= sc.nextInt(),K=sc.nextInt();
		int ans = 0;
		while(N/(int)Math.pow(K, ans)!=0) {
			
			ans++;
		}
		System.out.println(ans);
	}

}