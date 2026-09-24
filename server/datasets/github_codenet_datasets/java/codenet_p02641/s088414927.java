import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int X = sc.nextInt();
        int N = sc.nextInt();
        int res = 0;
        if (N == 0) {
            res = X;
        } else {
            List<Integer> array = new ArrayList<>();
            for (int i = 0; i < N; i++) {
                array.add(sc.nextInt());
            }
            Map<Integer, Integer> absMap = new HashMap<>();
            for (int i = 0; i <= 105; i++) {
                int abs = Math.abs(X - i);
                absMap.put(i, abs);
            }

            int minVal = Integer.MAX_VALUE;
            for (int i : absMap.keySet()) {
                int val = absMap.get(i);
                if (val < minVal && !array.contains(i)) {
                    res = i;
                    minVal = val;
                }
            }
        }
        sc.close();
        System.out.println(res);

    }
}
