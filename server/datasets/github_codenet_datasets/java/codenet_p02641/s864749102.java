import java.util.Scanner;
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int n = sc.nextInt();
        TreeSet<Integer> p = new TreeSet<>();
        for (int i = 0; i < n; i++) {
            p.add(sc.nextInt());
        }
        int[] arr = new int[102];
        for (int i : p) {
            arr[i] = 1;
        }
        int min = Integer.MAX_VALUE;
        int ans = 0;
        for (int i = 0; i < arr.length; i++) {
            if(arr[i] == 0) {
                if(min > Math.abs(x - i)) {
                    min = x - i;
                    ans = i;
                }
            }
        }
        System.out.println(ans);
    }
}