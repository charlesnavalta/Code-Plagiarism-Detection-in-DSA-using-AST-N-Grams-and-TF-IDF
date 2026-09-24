import java.util.*;

public class Main {
    public static void main(String[] args) {
        Main main = new Main();
        main.run();
    }
    
    // 変数一覧
    long x;
    long y500;
    long y5;

    public void run() {
        // 入力情報取得
        Scanner sc = new Scanner(System.in);
        x = sc.nextLong();
        sc.close();

        // 解答処理
        solve();
    }
    
    private void solve() {
        y500 = x / 500;
        x = x % 500;
        y5 = x / 5;
        long res = y500 * 1000 + y5 * 5;
        System.out.println(res);
    }
}