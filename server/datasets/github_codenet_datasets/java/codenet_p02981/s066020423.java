import java.util.*;
public class Main {
	Scanner sc = new Scanner(System.in);
	int a,b,c,d,e,f,k,l,m,n,x,y,z;
	int ans;
	String[] S;

	Main(){
		// 整数の入力
		n = sc.nextInt();
		a = sc.nextInt();
		b = sc.nextInt();

		// 出力
		System.out.println(Math.min(a*n,b));
	}

	public static void main(String[] args){
		new Main();
	}
}