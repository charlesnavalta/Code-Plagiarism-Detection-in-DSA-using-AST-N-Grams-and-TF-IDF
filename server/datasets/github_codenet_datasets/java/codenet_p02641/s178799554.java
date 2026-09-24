import java.util.*;
public class Main {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        int x = sc.nextInt();
        int n = sc.nextInt();
        
        HashMap<Integer, Integer> data = new HashMap<>();
        
        for(int i = 0; i<n;i++) {
          data.put(sc.nextInt(), 1);
        }
        
        int output = x;
        int diff = 0;
        
        while(true) {
          int val = x-diff;
          int val2 = x+diff;
          if(data.get(val) == null) {
            output = val;
            break;
          }
          
          if(data.get(val2) == null) {
            output = val2;
            break;
          }
          diff++;
        }
        
        System.out.println(output);
    }
}
