// Linked List Reversal - organic submission 2
// Functional style, plain nodes + free functions.

class Node {
    int value;
    Node nxt;

    public Node(int value, Node nxt) {
        this.value = value;
        this.nxt = nxt;
    }

    public Node(int value) {
        this(value, null);
    }
}

class Solution {
    public static Node fromValues(int[] values) {
        Node head = null;
        for (int i = values.length - 1; i >= 0; i--) {
            head = new Node(values[i], head);
        }
        return head;
    }

    public static Node reverse(Node head) {
        Node previous = null;
        Node current = head;
        while (current != null) {
            Node following = current.nxt;
            current.nxt = previous;
            previous = current;
            current = following;
        }
        return previous;
    }

    public static void show(Node head) {
        Node cur = head;
        StringBuilder sb = new StringBuilder();
        while (cur != null) {
            sb.append(cur.value);
            if (cur.nxt != null) sb.append(" -> ");
            cur = cur.nxt;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        Node head = fromValues(new int[]{10, 20, 30, 40});
        show(head);
        head = reverse(head);
        show(head);
    }
}
