// Linked List Reversal - organic submission 7
// Plain Node objects + standalone functions + self-test.

class Node {
    int value;
    Node next;

    public Node(int value) {
        this.value = value;
        this.next = null;
    }
}

class Solution {
    public static Node makeChain(int[] values) {
        Node head = null;
        Node tail = null;
        for (int v : values) {
            Node node = new Node(v);
            if (head == null) {
                head = node;
            } else {
                tail.next = node;
            }
            tail = node;
        }
        return head;
    }

    public static Node reverseChain(Node head) {
        Node prev = null;
        Node node = head;
        while (node != null) {
            Node tmp = node.next;
            node.next = prev;
            prev = node;
            node = tmp;
        }
        return prev;
    }

    public static void printChain(Node head) {
        Node cur = head;
        StringBuilder sb = new StringBuilder();
        while (cur != null) {
            sb.append(cur.value);
            if (cur.next != null) sb.append(" ");
            cur = cur.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        Node head = makeChain(new int[]{9, 7, 5, 3, 1});
        System.out.print("before: ");
        printChain(head);
        head = reverseChain(head);
        System.out.print("after:  ");
        printChain(head);
    }
}
