import java.util.Scanner;

public class Main{
    public static void main(String[] args){
        // 変数宣言
        int n;
        int k;
        int result = 0;
        int temp;

        // 標準入力
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        k = sc.nextInt();
        sc.close();

        temp = n;

        // 演算処理
        for( int index=1; temp >= k ; index++ ){
            temp = temp / k ;
            result = index;
        }
        result++;

        // 出力結果
        System.out.println( result );

    }
}