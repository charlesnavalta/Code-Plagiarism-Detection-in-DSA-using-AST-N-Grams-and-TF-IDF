import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in);

		int X = scan.nextInt();
		int N = scan.nextInt();
		int[] box = new int[N];
		int con=0;
		int min = X+100;
		int judge=0;
		int nbox;
		
		for(int i=0;i<N;i++) {
			box[i] = scan.nextInt();
			if(X==box[i]) {
				con=1;
			}
		}
		
		if(con==0) {
			System.out.print(X);
		}
		else {
			for(int i=1;i<=200-X;i++) {
				int a = X-i;
				int b = X+i;
				int acount=0;
				int bcount=0;
				if(a<=min||b<=min) {
					acount=0;
					bcount=0;
					for(int j=0;j<N;j++) {
						if(box[j] != a) {
							acount += 1;
						}
						if(box[j] != b) {
							bcount += 1;
							
							
						}
					}
					if(acount==N) {
						min=a;
						break;
					}
					else if(bcount==N) {
						min=b;
						break;
					}
				}
				
			}
			System.out.print(min);
		}



	}

}