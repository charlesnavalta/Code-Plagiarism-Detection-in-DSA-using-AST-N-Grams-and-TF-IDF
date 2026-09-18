// Linked List Reversal - "unique" outlier submission
// Deliberately different paradigm: stack-based rebuild.

import java.util.Stack;

class ListNode {
    int value;
    ListNode next;

    public ListNode(int value) {
        this.value = value;
        this.next = null;
    }
}

class Solution {
    public static ListNode buildList(int[] values) {
        ListNode head = null;
        ListNode tail = null;
        for (int v : values) {
            ListNode node = new ListNode(v);
            if (head == null) {
                head = tail = node;
            } else {
                tail.next = node;
                tail = node;
            }
        }
        return head;
    }

    public static ListNode reverseWithStack(ListNode head) {
        Stack<ListNode> stack = new Stack<>();
        ListNode node = head;
        while (node != null) {
            stack.push(node);
            node = node.next;
        }

        if (stack.isEmpty()) {
            return null;
        }

        ListNode newHead = stack.pop();
        ListNode current = newHead;
        while (!stack.isEmpty()) {
            current.next = stack.pop();
            current = current.next;
        }
        current.next = null;
        return newHead;
    }

    public static String toString(ListNode head) {
        StringBuilder sb = new StringBuilder();
        ListNode node = head;
        while (node != null) {
            sb.append(node.value);
            if (node.next != null) sb.append(" -> ");
            node = node.next;
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};
        ListNode head = buildList(numbers);
        System.out.println("Before: " + toString(head));
        ListNode reversedHead = reverseWithStack(head);
        System.out.println("After:  " + toString(reversedHead));
    }
}
