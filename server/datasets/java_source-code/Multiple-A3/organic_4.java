// Linked List Reversal - organic submission 4
// Convert to array, reverse array, rebuild list.

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Node {
    int data;
    Node next;

    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class Solution {
    public static Node buildLinkedList(int[] items) {
        Node dummy = new Node(0);
        Node cur = dummy;
        for (int item : items) {
            cur.next = new Node(item);
            cur = cur.next;
        }
        return dummy.next;
    }

    public static Node reverseViaArray(Node head) {
        List<Integer> values = new ArrayList<>();
        Node cur = head;
        while (cur != null) {
            values.add(cur.data);
            cur = cur.next;
        }
        Collections.reverse(values);
        int[] arr = new int[values.size()];
        for (int i = 0; i < values.size(); i++) arr[i] = values.get(i);
        return buildLinkedList(arr);
    }

    public static void printNodes(Node head) {
        Node cur = head;
        StringBuilder sb = new StringBuilder();
        while (cur != null) {
            sb.append(cur.data);
            if (cur.next != null) sb.append(" -> ");
            cur = cur.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        Node head = buildLinkedList(new int[]{5, 4, 3, 2, 1});
        printNodes(head);
        head = reverseViaArray(head);
        printNodes(head);
    }
}
