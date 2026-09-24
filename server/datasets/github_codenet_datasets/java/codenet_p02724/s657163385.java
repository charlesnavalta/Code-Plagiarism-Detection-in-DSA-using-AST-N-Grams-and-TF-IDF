import java.util.Scanner;
public class Main {
	public static void main(String[] args) {

//	入力の読み込み
		Scanner sc = new Scanner(System.in);
		int total = sc.nextInt();

//	500円玉と5円玉の枚数を数える
		int ureshisa500 = total/500;
		int ureshisa5 = (total%500)/5;

		//	枚数分の 嬉しさ を計算して表示
		System.out.print(ureshisa500*1000 + ureshisa5*5);
	}
}
