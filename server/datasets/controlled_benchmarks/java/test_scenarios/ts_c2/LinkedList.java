public class LinkedList {

    // Replicating the Python Node class
    static class Node {
        int data;
        Node next;

        public Node(int data) {
            this.data = data;
            this.next = null;
        }
    }

    Node head;

    // Replicating def __init__(self)
    public LinkedList() {
        this.head = null;
    }

    public boolean search(int target) {
        Node current = this.head;
        
        // Standard traversal logic
        while (current != null) {
            if (current.data == target) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    public static void main(String[] args) {
        // Execution
        LinkedList ll = new LinkedList();
        ll.head = new Node(10);
        
        System.out.println(ll.search(10));
    }
}