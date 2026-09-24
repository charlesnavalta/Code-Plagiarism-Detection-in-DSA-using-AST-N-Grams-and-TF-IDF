// Linked List Reversal - DISGUISE: reordered
// Derived from organic_1.py. Same logic and output, but statement/method
// order has been shuffled: display defined first, then reverse, then append.

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

    public void display() {
        Node current = this.head;
        StringBuilder sb = new StringBuilder();
        while (current != null) {
            sb.append(current.data);
            if (current.next != null) {
                sb.append(" -> ");
            }
            current = current.next;
        }
        System.out.println(sb.toString());
    }

    public void reverse() {
        Node curr = this.head;
        Node prev = null;
        while (curr != null) {
            Node nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        this.head = prev;
    }

    public void append(int data) {
        Node newNode = new Node(data);
        if (this.head == null) {
            this.head = newNode;
            return;
        }
        Node current = this.head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }

    public static void main(String[] args) {
        LinkedList ll = new LinkedList();
        for (int value : new int[]{1, 2, 3, 4, 5}) {
            ll.append(value);
        }
        System.out.println("Original list:");
        ll.display();
        ll.reverse();
        System.out.println("Reversed list:");
        ll.display();
    }
}
