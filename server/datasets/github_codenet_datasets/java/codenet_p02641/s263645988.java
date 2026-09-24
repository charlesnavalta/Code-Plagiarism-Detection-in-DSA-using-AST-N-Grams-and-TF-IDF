import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
public class Main{
	public static void main(String[] args)
	{
		 Scanner sc=new Scanner(System.in);
		 int i=sc.nextInt();
		 int j=sc.nextInt();
		 int arr[]=new int[j];
		 List li1=new ArrayList();
		 if(j==0)
		 {
			 System.out.println(i);
			 System.exit(0);
		 }
		 for(int k=0;k<j;k++)
		 {
			 arr[k]=sc.nextInt();
			 li1.add(arr[k]);
		 }
		 if(!li1.contains(i))
		 {
			 System.out.println(i);
			 System.exit(0);
		 }
		
		 for(int k=0;k<=j;k++)
		 {
			if((li1.contains(i+k))&&(li1.contains(i-k)))
			 { 
				 continue;
			 }
           
			 if(!li1.contains(i-k))
			 {
				 System.out.println(i-k);
                 break;
				 
			 }
			 if(!li1.contains(i+k))
			 {
				 System.out.println(i+k);
                 break;
				 
			 }	 
		 }
		 
		 
	}
 
}