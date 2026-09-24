import java.util.Scanner;

public class Main
{

	public static void main(String args[])
	{

		int count = 0;
		int temp = 0;

		Scanner sc = new Scanner(System.in);

		int x = sc.nextInt();
		int n = sc.nextInt();

		int [] p = new int[n];

		for(int i = 0; i < n; i++)
		{
			p[i] = sc.nextInt();
		}
		sc.close();

		for(int i = 0; i < n; i++)
		{
			if(x == p[i])
			{

				count++;

				temp = count;

				for(int j = 0; j < count; j++)
				{
					temp *= -1;
				}

				x += temp;

				i = -1;

			}
		}

		System.out.println(x);
	}

}
