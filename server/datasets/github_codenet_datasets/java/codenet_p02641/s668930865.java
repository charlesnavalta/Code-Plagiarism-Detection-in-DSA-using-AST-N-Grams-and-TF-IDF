import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);

        int X = in.nextInt();   // 整数
        int N = in.nextInt();   // 長さ
        int p[] = new int[N];
        for(int i=0; i<N; i++)
            p[i] = in.nextInt();
        int tmp = 0;

        for(int i=0; tmp==0; i++){
            tmp = 1;
            for(int j=0; j<N; j++){
                if( X-i == p[j]){
                    tmp = 0;
                }
            }
            if(tmp == 1){
                System.out.println(X-i);
                break;
            }
            tmp = 1;
            for(int j=0; j<N; j++){
                if( X+i == p[j]){
                    tmp = 0;
                }
            }
            if(tmp == 1){
                System.out.println(X+i);
                break;
            }
        }
    }
}