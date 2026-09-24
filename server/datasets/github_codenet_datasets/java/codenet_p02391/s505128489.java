import java.util.Scanner;

public class Main
{

	public static void main(String[] args)
	{
		Scanner in = new Scanner(System.in);
		int m, n;
		m = in.nextInt();
		n = in.nextInt();
		if (m < n)
			System.out.println("a < b");
		else if (m == n)
			System.out.println("a == b");
		else
		{
			System.out.println("a > b");
		}

	}

}