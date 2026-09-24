import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int a = sc.nextInt();
        int b = sc.nextInt();
        String r = "";
        if(a < b) {
            r = "a < b";
        }
        else if (a > b) {
            r = "a > b";
        }
        else {
            r = "a == b";
        }
        System.out.println(r);

        sc.close();
    }
}
