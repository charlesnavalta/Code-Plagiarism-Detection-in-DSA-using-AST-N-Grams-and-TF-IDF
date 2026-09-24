// Linked List Reversal - DISGUISE: method-extracted
// Derived from organic_1.py. The pointer-swap step inside reverse() has been
// pulled out into a separate helper method swapPointers.

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

    private Node[] swapPointers(Node prev, Node curr) {
        Node nextNode = curr.next;
        curr.next = prev;
        return new Node[]{curr, nextNode};
    }

    public void reverse() {
        Node prev = null;
        Node curr = this.head;
        while (curr != null) {
            Node[] swapped = swapPointers(prev, curr);
            prev = swapped[0];
            curr = swapped[1];
        }
        this.head = prev;
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
