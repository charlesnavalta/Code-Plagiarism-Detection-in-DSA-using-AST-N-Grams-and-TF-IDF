// Linked List Reversal - organic submission 5
// Iterative with length() helper and different variable names.

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

    public void pushBack(int val) {
        Node n = new Node(val);
        if (this.head == null) {
            this.head = n;
            return;
        }
        Node ptr = this.head;
        while (ptr.next != null) {
            ptr = ptr.next;
        }
        ptr.next = n;
    }

    public int length() {
        int count = 0;
        Node cur = this.head;
        while (cur != null) {
            count++;
            cur = cur.next;
        }
        return count;
    }

    public void invert() {
        Node before = null;
        Node target = this.head;
        while (target != null) {
            Node after = target.next;
            target.next = before;
            before = target;
            target = after;
        }
        this.head = before;
    }

    public void show() {
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
        for (int i = 1; i <= 6; i++) ll.pushBack(i * 10);
        System.out.println("len=" + ll.length());
        ll.show();
        ll.invert();
        ll.show();
    }
}
