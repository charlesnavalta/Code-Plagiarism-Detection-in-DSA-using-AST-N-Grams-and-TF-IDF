// Linked List Reversal - organic submission 8
// Class-based with manual pointer swaps count.

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

    public LinkedList(int[] items) {
        this.head = null;
        if (items != null) {
            for (int i : items) {
                this.append(i);
            }
        }
    }

    public void append(int data) {
        Node n = new Node(data);
        if (this.head == null) {
            this.head = n;
            return;
        }
        Node cur = this.head;
        while (cur.next != null) {
            cur = cur.next;
        }
        cur.next = n;
    }

    public void reverse() {
        Node prevNode = null;
        Node curNode = this.head;
        int swaps = 0;
        while (curNode != null) {
            Node nxtNode = curNode.next;
            curNode.next = prevNode;
            prevNode = curNode;
            curNode = nxtNode;
            swaps++;
        }
        this.head = prevNode;
        System.out.println("performed " + swaps + " pointer swaps");
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
        LinkedList ll = new LinkedList(new int[]{11, 22, 33, 44, 55});
        ll.printList();
        ll.reverse();
        ll.printList();
    }
}
