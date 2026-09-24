import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] lines = br.readLine().split(" ");
        int a = Integer.parseInt(lines[0]);
        int b = Integer.parseInt(lines[1]);
        String s = "";
        if (a == b) {
            s = "==";
        } else if (a < b) {
            s = "<";
        } else {
            s = ">";
        }
        System.out.println("a "+s+" b");
    }

}