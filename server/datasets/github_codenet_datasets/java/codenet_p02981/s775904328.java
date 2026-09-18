import java.util.Scanner;
public class Main {
	public static void main(String[] args)throws Exception{
		Scanner stdIn=new Scanner(System.in);
		int N=stdIn.nextInt();
		int A=stdIn.nextInt();
		int B=stdIn.nextInt();
		if(A*N<=B)
			System.out.println(A*N);
		else
			System.out.println(B);
	}
}