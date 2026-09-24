import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int n = sc.nextInt();
        int[] v = new int[102];

        if (n == 0) {
            System.out.println(x);
            return;
        }

        for (int i = 0; i < n; i++) {
            int p = sc.nextInt();
            v[p] = 1;
        }

        int left = 0, right = 0, ans_le = 0, ans_ri = 0;
        for (int i = x; i < v.length; i++) {
            if (v[i] == 0) {
                right = i - x;
                ans_ri = i;
                break;
            }
        }

        for (int i = x; i >= 0; i--) {
            if (v[i] == 0) {
                left = x - i;
                ans_le = i;
                break;
            }
        }

        if (left > right) {
            System.out.println(ans_ri);
        } else {
            System.out.println(ans_le);
        }
    }
}