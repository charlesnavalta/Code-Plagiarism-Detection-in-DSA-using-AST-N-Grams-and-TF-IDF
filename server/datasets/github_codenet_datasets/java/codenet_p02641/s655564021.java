import java.util.*;

public class Main{
  public static void main(String[] args){
    Scanner sc = new Scanner(System.in);
    int key = sc.nextInt();
    int num = sc.nextInt();
    if(num > 0){
      int map[] = new int[102];
      for(int i = 0;i < 102;i++){
        map[i] = 0;
      }
      for(int i = 0;i < num;i++){
        int n = sc.nextInt();
        map[n] = n;
      }
      int plus = key;
      int minus = key;
      while(map[plus] != 0 && map[minus] != 0){
        plus++;
        minus--;
        if(map[plus] == 0 && map[minus] == 0){
            break;
        }
        else if(map[plus] == 0){
            minus--;
        }
        else if(map[minus] == 0){
            plus++;
        }
        
      }
      if(key - minus <= plus - key){
        System.out.println(minus);
      }
      else{
        System.out.println(plus);
      }
    }
    else{
      System.out.println(key);
    }
  }
}