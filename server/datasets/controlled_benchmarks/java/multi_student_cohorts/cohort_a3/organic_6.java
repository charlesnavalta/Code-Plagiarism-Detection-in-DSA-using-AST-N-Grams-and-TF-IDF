// Linked List Reversal - organic submission 6
// Recursive reversal helper with Node and LinkedList.

class Node {
    int data;
    Node next;

    public Node(int data, Node next) {
        this.data = data;
        this.next = next;
    }

    public Node(int data) {
        this(data, null);
    }
}

class LinkedList {
    Node head;

    public LinkedList() {
        this.head = null;
    }

    public void add(int value) {
        if (this.head == null) {
            this.head = new Node(value);
            return;
        }
        Node cur = this.head;
        while (cur.next != null) {
            cur = cur.next;
        }
        cur.next = new Node(value);
    }

    public void reverse() {
        this.head = recursiveReverse(this.head, null);
    }

    private Node recursiveReverse(Node node, Node carried) {
        if (node == null) {
            return carried;
        }
        Node following = node.next;
        node.next = carried;
        return recursiveReverse(following, node);
    }

    public void printList() {
        Node cur = this.head;
        StringBuilder sb = new StringBuilder();
        while (cur != null) {
            sb.append(cur.data);
            if (cur.next != null) sb.append(" ");
            cur = cur.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        LinkedList ll = new LinkedList();
        for (int n : new int[]{100, 200, 300}) {
            ll.add(n);
        }
        ll.printList();
        ll.reverse();
        ll.printList();
    }
}
