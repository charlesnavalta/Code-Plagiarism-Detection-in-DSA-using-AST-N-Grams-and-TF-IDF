import java.util.Scanner;
 
public class Main {
 
	public static void main(String[]args){
		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();
		int happynesspoint,k,j;
		if(n>=0){
			k = n/500;
			j= n%500;
			happynesspoint = 1000*k+5*(j/5);
		System.out.println(happynesspoint);
	}
}
}