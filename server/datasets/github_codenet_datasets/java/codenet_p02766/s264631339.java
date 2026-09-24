import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		Scanner scan = new Scanner(System.in);

		int N;
		int K;

		N = scan.nextInt();
		K = scan.nextInt();

		// 割れる回数=桁数
		int ans  = 0;

		while(N  > 0) {
			// NをKで割った商で置き換える
			N = N / K;
			// Nが0になるまでカウント
			ans++;
		}

		System.out.println(ans);

	}
}