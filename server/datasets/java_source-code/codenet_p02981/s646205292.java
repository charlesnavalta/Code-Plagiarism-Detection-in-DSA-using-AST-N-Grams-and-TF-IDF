import java.util.*;
import java.io.*;

public class Main
{
	public static void main(String [] Args)
	{
		Scanner in=new Scanner(System.in);
		int n=in.nextInt();
		int a=in.nextInt();
		int b=in.nextInt();
		System.out.println(Math.min(n*a,b));
	}
}
	