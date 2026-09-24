// Linked List Reversal - organic submission 9
// Adds insertAtHead alongside append, reverses using while-true/break.

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

    public void insertAtHead(int data) {
        Node n = new Node(data);
        n.next = this.head;
        this.head = n;
    }

    public void append(int data) {
        Node n = new Node(data);
        if (this.head == null) {
            this.head = n;
            return;
        }
        Node walker = this.head;
        while (true) {
            if (walker.next == null) {
                break;
            }
            walker = walker.next;
        }
        walker.next = n;
    }

    public void reverse() {
        Node previous = null;
        Node current = this.head;
        while (true) {
            if (current == null) {
                break;
            }
            Node nxt = current.next;
            current.next = previous;
            previous = current;
            current = nxt;
        }
        this.head = previous;
    }

    public void printValues() {
        Node walker = this.head;
        StringBuilder sb = new StringBuilder();
        while (walker != null) {
            sb.append(walker.data);
            if (walker.next != null) sb.append(" ");
            walker = walker.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        LinkedList ll = new LinkedList();
        for (int v : new int[]{3, 1, 4, 1, 5, 9}) {
            ll.append(v);
        }
        ll.insertAtHead(0);
        ll.printValues();
        ll.reverse();
        ll.printValues();
    }
}
