import java.util.*;
public class Main {
	public static void main(String[] args){
		Scanner sc = new Scanner(System.in);
		// 整数の入力
        int a = sc.nextInt();
     	int b = sc.nextInt();
        int count = 0;
        
        while(true){
          if(a >= b){
          a = a / b;
          count += 1;
          }else{
            count+= 1;
            break;
          }
        }
		
        
          System.out.println(count);

    }
}