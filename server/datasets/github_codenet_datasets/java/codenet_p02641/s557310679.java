
import java.util.*;
import java.io.*;

public class Main{
	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
		String[] cmd=br.readLine().split(" ");
		int x=Integer.valueOf(cmd[0]);
		int n=Integer.valueOf(cmd[1]);
		int[] arr=new int[200];
		cmd=br.readLine().split(" ");
		for(int i=0;i<n;i++)
		{
			arr[Integer.valueOf(cmd[i])]=1;
		}
		int len=0;
		int ans=-1;
		while(true)
		{
			int a=x-len;
			int b=x+len;
			if(arr[a]==0)
			{
				ans=a;
				break;
			}
			if(arr[b]==0)
			{
				ans=b;
				break;
			}
			len++;
		}
		System.out.println(ans);
	}

}
