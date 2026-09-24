// Linked List Reversal - organic submission 3
// Class-based, naming/API: insertEnd, reverseList, printList.

class Node {
    int val;
    Node nextNode;

    public Node(int val) {
        this.val = val;
        this.nextNode = null;
    }
}

class SinglyLinkedList {
    Node first;

    public SinglyLinkedList() {
        this.first = null;
    }

    public void insertEnd(int val) {
        Node node = new Node(val);
        if (this.first == null) {
            this.first = node;
            return;
        }
        Node temp = this.first;
        while (temp.nextNode != null) {
            temp = temp.nextNode;
        }
        temp.nextNode = node;
    }

    public void reverseList() {
        Node left = null;
        Node mid = this.first;
        while (mid != null) {
            Node right = mid.nextNode;
            mid.nextNode = left;
            left = mid;
            mid = right;
        }
        this.first = left;
    }

    public void printList() {
        Node p = this.first;
        StringBuilder sb = new StringBuilder();
        while (p != null) {
            sb.append(p.val);
            if (p.nextNode != null) sb.append(" -> ");
            p = p.nextNode;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        SinglyLinkedList sll = new SinglyLinkedList();
        for (int v : new int[]{7, 14, 21, 28}) {
            sll.insertEnd(v);
        }
        sll.printList();
        sll.reverseList();
        sll.printList();
    }
}
