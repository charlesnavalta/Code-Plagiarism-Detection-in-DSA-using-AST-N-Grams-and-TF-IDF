import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String[] str1 = sc.nextLine().split(" ");
    String[] str2 = sc.nextLine().split(" ");
    int x = Integer.parseInt(str1[0]);
    int n = Integer.parseInt(str1[1]);
    if(n==0) {
        System.out.println(x);
    }
    else {
        List<String> list = new ArrayList<String>();
        for(int i = 0 ; i < 102;i++) {
          list.add((((Integer)i).toString()));
        }
        for(int i = 0 ; i < str2.length;i++) {
            list.remove (str2[i]);
        }
        int cnt=9999;
        int ansX=9999;
        for(String num2 : list) {
            int num = Integer.parseInt(num2);
            if(Math.abs(num-x) <cnt) {
                cnt = Math.abs(num-x);
                ansX = num;
            }
        }
        System.out.println(ansX);
    }
  }
}