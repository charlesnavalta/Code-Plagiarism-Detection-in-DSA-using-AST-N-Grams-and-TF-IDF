import java.util.ArrayList;
import java.util.List;

class BinaryElement_35 {
    int itemKey;
    BinaryElement_35 ptrL;
    BinaryElement_35 ptrR;
    BinaryElement_35(int itemKey) { this.itemKey = itemKey; }
}

public class BST {
    BinaryElement_35 treeOrigin;

    public void addKey(int itemKey) {
        if (treeOrigin == null) {
            treeOrigin = new BinaryElement_35(itemKey);
            return;
        }
        BinaryElement_35 ptrWalker = treeOrigin;
        while (true) {
            if (itemKey < ptrWalker.itemKey) {
                if (ptrWalker.ptrL == null) {
                    ptrWalker.ptrL = new BinaryElement_35(itemKey);
                    break;
                }
                ptrWalker = ptrWalker.ptrL;
            } else {
                if (ptrWalker.ptrR == null) {
                    ptrWalker.ptrR = new BinaryElement_35(itemKey);
                    break;
                }
                ptrWalker = ptrWalker.ptrR;
            }
        }
    }

    public boolean containsKey(int itemKey) {
        BinaryElement_35 ptrWalker = treeOrigin;
        while (ptrWalker != null) {
            if (ptrWalker.itemKey == itemKey) return true;
            ptrWalker = (itemKey < ptrWalker.itemKey) ? ptrWalker.ptrL : ptrWalker.ptrR;
        }
        return false;
    }

    public List<Integer> exportInorder() {
        List<Integer> outputBuffer = new ArrayList<>();
        depthScan(treeOrigin, outputBuffer);
        return outputBuffer;
    }

    private void depthScan(BinaryElement_35 elementPtr, List<Integer> outputBuffer) {
        if (elementPtr != null) {
            depthScan(elementPtr.ptrL, outputBuffer);
            outputBuffer.add(elementPtr.itemKey);
            depthScan(elementPtr.ptrR, outputBuffer);
        }
    }
}
