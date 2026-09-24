import java.util.*;
import java.io.*;
import java.lang.*;

public class Main {
	public static void main (String[] args) {
		Scanner sc = new Scanner(System.in);
		int x = sc.nextInt();
		sc.close();
		int fiveHundred = 0, five = 0, one = 0;
		while (x!=0) {
			if (x%500 == 0) {
				x-=500; fiveHundred++;
			} else if (x%5 == 0) {
				x-=5; five++;
			} else {
				x-=1; one++;
			}
		}

		System.out.println(1000 * fiveHundred + 5 * five);
	}
}
