import unittest
import os
import sys

SERVER_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if SERVER_DIR not in sys.path:
    sys.path.insert(0, SERVER_DIR)

from engines.languages.java_engine import process_java_file
from engines.languages.python_engine import process_python_file
from engines.detection.comparator import compare_all_files


class TestDetectionAndHighlighting(unittest.TestCase):
    def test_user_safe_pair_no_type1_highlights(self):
        """Verify that testing1.java and testing2.java (from user screenshot) evaluate as Safe with 0 plagiarism highlights."""
        code1 = """public class Main {
    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 20;

        num1 += num2;

        System.out.println("Sum: " + num1);
    }
}"""

        code2 = """public class Main {
    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 20;

        int sum = num1 + num2;

        System.out.println("Sum: " + sum);
    }
}"""

        doc1, tokens1 = process_java_file(code1)
        doc2, tokens2 = process_java_file(code2)

        files = [
            {'name': 'testing1.java', 'doc': doc1, 'tokens': tokens1, 'raw_code': code1},
            {'name': 'testing2.java', 'doc': doc2, 'tokens': tokens2, 'raw_code': code2}
        ]
        results = compare_all_files(files, (3, 5))
        self.assertEqual(len(results), 1)
        res = results[0]

        # Verify evaluation status and taxonomy
        self.assertEqual(res['status'], 'Low')
        self.assertEqual(res['plagiarism_type'], 'Safe: Original Code')
        # Crucial fix: Safe code must NOT flag lines as Type 1 clone
        self.assertEqual(res['lines1'], [], "Safe code must have empty flagged plagiarism lines")
        self.assertEqual(res['lines2'], [], "Safe code must have empty flagged plagiarism lines")
        self.assertEqual(res['renamed_line_count'], 0)
        # Forensic metrics must be accurately calculated, not 0%
        self.assertGreater(res['raw_identity_score'], 0.0)
        self.assertGreater(res['order_similarity_score'], 0.0)

    def test_type1_exact_copy(self):
        """Verify Type 1 verbatim clone has Type 1 classification and type 1 line highlights."""
        code = """public class Search {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}"""
        doc1, tokens1 = process_java_file(code)
        doc2, tokens2 = process_java_file(code)

        files = [
            {'name': 'f1.java', 'doc': doc1, 'tokens': tokens1, 'raw_code': code},
            {'name': 'f2.java', 'doc': doc2, 'tokens': tokens2, 'raw_code': code}
        ]
        results = compare_all_files(files, (3, 5))
        self.assertEqual(len(results), 1)
        res = results[0]

        self.assertEqual(res['status'], 'High')
        self.assertEqual(res['plagiarism_type'], 'Type 1: Exact Copy')
        self.assertTrue(len(res['lines1']) > 0)
        self.assertTrue(all(item['type'] == 1 for item in res['lines1']))
        self.assertTrue(all(item['line'] > 0 for item in res['lines1']))

    def test_type2_renamed_variables(self):
        """Verify Type 2 renamed variable clone has Type 2 classification and type 2 line highlights."""
        code1 = """public class Search {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}"""
        code2 = """public class SearchAlgo {
    public static int findElement(int[] numbers, int key) {
        for (int idx = 0; idx < numbers.length; idx++) {
            if (numbers[idx] == key) {
                return idx;
            }
        }
        return -1;
    }
}"""
        doc1, tokens1 = process_java_file(code1)
        doc2, tokens2 = process_java_file(code2)

        files = [
            {'name': 'f1.java', 'doc': doc1, 'tokens': tokens1, 'raw_code': code1},
            {'name': 'f2.java', 'doc': doc2, 'tokens': tokens2, 'raw_code': code2}
        ]
        results = compare_all_files(files, (3, 5))
        self.assertEqual(len(results), 1)
        res = results[0]

        self.assertEqual(res['status'], 'High')
        self.assertEqual(res['plagiarism_type'], 'Type 2: Renamed Variables')
        self.assertTrue(len(res['lines1']) > 0)
        self.assertTrue(all(item['type'] == 2 for item in res['lines1']))
        self.assertTrue(all(item['line'] > 0 for item in res['lines1']))

    def test_java_position_propagation(self):
        """Verify that Java AST nodes without explicit positions inherit line numbers from parents."""
        code = """public class Main {
    public static void main(String[] args) {
        int x = 42;
        int y = x + 100;
        System.out.println(y);
    }
}"""
        doc, tokens = process_java_file(code)
        # Check that VariableDeclarator and child tokens have positive line numbers
        non_compilation_tokens = [t for t in tokens if t[0] != 'CompilationUnit']
        for t in non_compilation_tokens:
            self.assertGreater(t[1], 0, f"Token {t} should have a positive line number")


if __name__ == '__main__':
    unittest.main()
