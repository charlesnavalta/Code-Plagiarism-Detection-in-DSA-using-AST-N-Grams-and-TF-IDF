
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        String arg = br.readLine();
        String[] inputArray = arg.split(" ");
        int[] inputIntArray = new int[inputArray.length];

        for (int count = 0; count < inputIntArray.length; count++) {
            inputIntArray[count] = Integer.parseInt(inputArray[count]);
        }
        int x = inputIntArray[0];
        int y = inputIntArray[1];
        String retStr;

        if (x < y) {
            retStr = "a < b";
        } else if (x == y) {
            retStr = "a == b";

        } else {
            retStr = "a > b";
        }

        System.out.println(retStr);
    }
}