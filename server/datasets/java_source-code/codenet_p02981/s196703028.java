import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {

	public static void main(String[] args) throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		String numbers[] = br.readLine().split(" ");
		int N = Integer.parseInt(numbers[0]);
		int A = Integer.parseInt(numbers[1]);
		int B = Integer.parseInt(numbers[2]);
		int trainCost = N * A;
		if (trainCost < B) {
			System.out.println(trainCost);
		} else
			System.out.println(B);
	}

}