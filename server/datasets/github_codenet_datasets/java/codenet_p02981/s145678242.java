import java.util.Scanner;

public class Main {
	public static void main(String[] args) {
		// 自分の得意な言語で
		// Let's チャレンジ！！

		Scanner sc = new Scanner(System.in);
		int num = sc.nextInt();
		int a=sc.nextInt();
		int b=sc.nextInt();
		int ans=0;
		if(a*num<b) ans=a*num;
		else ans=b;
						System.out.println(ans);
	}
}