    import java.util.*;
     
    class Main {
      public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int n = sc.nextInt();
        int[] a = new int[n];
        for(int i = 0; i < n; i++)
          a[i] = sc.nextInt();
        
        Arrays.sort(a);
        int t=0,ans=0,f=0;
        while(f == 0) {
          if(Arrays.binarySearch(a, x-t) < 0) {
           ans = x - t;
            f = 1;
          } else if(Arrays.binarySearch(a, x+t) < 0) {
            ans = x + t;
            f = 1;
          }
          t++;
        }
        System.out.println(ans);
      }
    }