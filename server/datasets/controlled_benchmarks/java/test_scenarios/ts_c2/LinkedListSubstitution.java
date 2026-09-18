public class LinkedListSubstitution {

    static class Node {
        int data;
        Node next;

        public Node(int val) {
            this.data = val;
            this.next = null;
        }
    }

    Node head;

    public LinkedListSubstitution() {
        this.head = null;
    }

    public boolean search(int key) {
        Node curr = this.head;
        
        // Logic Substitution: using '!(... == null)' instead of '!= null'
        while (!(curr == null)) {
            // Substitution: checking if they are NOT different 
            // instead of checking if they are equal
            if (!(curr.data != key)) {
                return true;
            }
            
            // Semantic equivalent traversal
            // Java is statically typed, so the compiler guarantees the 'next' field exists.
            // There is no need for Python's dynamic `hasattr` or `__getattribute__`.
            curr = curr.next;
        }
        
        return false;
    }

    public static void main(String[] args) {
        // Execution
        LinkedListSubstitution ll = new LinkedListSubstitution();
        ll.head = new Node(10);
        
        System.out.println(ll.search(10));
    }
}