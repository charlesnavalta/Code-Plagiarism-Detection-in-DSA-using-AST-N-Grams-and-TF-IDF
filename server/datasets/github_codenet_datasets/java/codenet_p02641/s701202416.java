import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int x = sc.nextInt();
		int n = sc.nextInt();
		int p[] = new int[n];
		for(int i=0;i<n;i++) {
			p[i] = sc.nextInt();
		}
		int idx =-1;
		int min = 1000;
		Set<Integer> s=  new HashSet<Integer>();
		for(int i=0;i<n;i++) {
			s.add(p[i]);
		}
		for(int i=-100;i<=200;i++) {
			if(!s.contains(i) && Math.abs(i-x)<min) {
				min = Math.abs(i-x);
				idx = i;
			}
		}
		System.out.println(idx);
	}
}
