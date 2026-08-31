// Linked List Reversal - organic submission 10
// List iteration and reversal rebuilding links.

class Node {
    int data;
    Node next;

    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    Node head;

    public LinkedList() {
        this.head = null;
    }

    public void add(int data) {
        Node n = new Node(data);
        if (this.head == null) {
            this.head = n;
            return;
        }
        Node c = this.head;
        while (c.next != null) {
            c = c.next;
        }
        c.next = n;
    }

    public void reverse() {
        Node prev = null;
        Node cur = this.head;
        while (cur != null) {
            Node nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        this.head = prev;
    }

    public void display() {
        Node c = this.head;
        StringBuilder sb = new StringBuilder();
        while (c != null) {
            sb.append(c.data);
            if (c.next != null) sb.append(" -> ");
            c = c.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        LinkedList ll = new LinkedList();
        for (int i = 1; i <= 5; i++) ll.add(i);
        ll.display();
        ll.reverse();
        ll.display();
    }
}
