import java.util.*;
public class Main {
	public static void main(String[] args){
		Scanner sc = new Scanner(System.in);
		int x = sc.nextInt();
		int n = sc.nextInt();
		if(n==0){
			System.out.println(x);
			System.exit(0);
		}
		int ans1=0;
		int ans2=0;
		List<Integer> l = new ArrayList<Integer>();
		for(int i = 0;i<n;i++){
			l.add(sc.nextInt());
		}
		int count = 0;
		boolean flg1 = false;
		boolean flg2 = false;
		while(!flg1&&!flg2){

			if(!l.contains(x+count)){
				flg1 = true;
				ans1 = x+count;
			}
			if(!l.contains(x-count)){
				flg2 = true;
				ans2 = x-count;
			}
          count++;
		}
		if(flg2){
			System.out.println(ans2);
		}else{
			System.out.println(ans1);
		}		
	}
}
