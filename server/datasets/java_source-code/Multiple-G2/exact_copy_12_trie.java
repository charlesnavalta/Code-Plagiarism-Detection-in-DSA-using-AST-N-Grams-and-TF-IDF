// Student 12 Trie
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd = false;
}
public class TrieStructure {
    public static void main(String[] args) {
        TrieStructure t = new TrieStructure();
        t.insertWord("abc");
        t.searchWord("abc");
    }
    TrieNode root = new TrieNode();
    public void insertWord(String word) {
        TrieNode curr = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }
    public boolean searchWord(String word) {
        TrieNode curr = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return curr.isEnd;
    }
}
// End 12
