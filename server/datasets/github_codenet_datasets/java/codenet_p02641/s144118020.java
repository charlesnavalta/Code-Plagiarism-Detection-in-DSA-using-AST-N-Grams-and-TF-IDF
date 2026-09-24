import java.util.*;
import java.io.*;

public class Main {
    public static void main(String args[]) {
      Scanner sc = new Scanner(System.in);

      int x = sc.nextInt();
      int n = sc.nextInt();
      int[] arr = new int[n];
      for(int i = 0; i < n; i++){
          arr[i] = sc.nextInt();
      }
      Arrays.sort(arr);
      
      int best = x;
      int minDistance = n;
      for(int i = 0; i <= 101; i++){
          boolean good = true;
          for(int j = 0; j < n; j++){
              if(arr[j] == i){
                  good = false;
                  break;
              }
          }
          if(good){
              if(Math.abs(x - i) < minDistance){
                  minDistance = Math.abs(x-i);
                  best = i;
              } else if(Math.abs(x-i) == minDistance){
                  best = Math.min(best, i);
              }
          }
      }
      System.out.println(best);
    }
}