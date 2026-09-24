import java.io.*;

class Main{	
	public static void main(String[] args){
		int a, b;
		String buf;
		try{
			BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
			
			String[] ab = br.readLine().split(" ");
			a = Integer.parseInt(ab[0]);
			b = Integer.parseInt(ab[1]);
			
			if(a > b){
				System.out.println("a > b");
			} else if ( a < b ){
				System.out.println("a < b");
			} else if ( a == b ){
				System.out.println("a == b");
			}
		} catch(Exception e){
		}
	}
}