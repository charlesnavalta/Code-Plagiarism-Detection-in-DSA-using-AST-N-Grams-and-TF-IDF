import java.util.Scanner;
 
public class Main {
 
	public static final MyScanner in = new MyScanner();
	public static int[][][][] memo;
 
	public static void main(String[] args) {
 
		long N = in.nextLong();
		long K = in.nextLong();
		int cnt = 1;
		N += 1;
		while(N > Math.pow(K, cnt)) cnt++;
 
		System.out.println(cnt);
 
	}
 
 
	public static class MyScanner{
		Scanner sc = new Scanner(System.in);
		String nextLine() {return sc.nextLine();}
		String next() {return sc.next();}
		int nextInt() {return Integer.valueOf(sc.next());}
		long nextLong() { return Long.valueOf(sc.next());}
	}
}