// MergeSort Suite: Renamed Identifiers
// Author: Renamed Variant (Type 2 of Mary)
public class ListMergerEngine {
    private int[] rawItems;
    private long invCounter;

    public ListMergerEngine(int[] initial) {
        this.rawItems = (initial != null) ? initial.clone() : new int[0];
        this.invCounter = 0;
    }

    private int[] combineHalves(int[] leftPart, int[] rightPart) {
        int[] mergedBuffer = new int[leftPart.length + rightPart.length];
        int ptrA = 0, ptrB = 0, cursor = 0;
        while (ptrA < leftPart.length && ptrB < rightPart.length) {
            if (leftPart[ptrA] <= rightPart[ptrB]) {
                mergedBuffer[cursor++] = leftPart[ptrA++];
            } else {
                mergedBuffer[cursor++] = rightPart[ptrB++];
                this.invCounter += (leftPart.length - ptrA);
            }
        }
        while (ptrA < leftPart.length) mergedBuffer[cursor++] = leftPart[ptrA++];
        while (ptrB < rightPart.length) mergedBuffer[cursor++] = rightPart[ptrB++];
        return mergedBuffer;
    }

    private int[] divideAndSort(int[] sequence) {
        if (sequence.length <= 1) return sequence;
        int center = sequence.length / 2;
        int[] partL = new int[center];
        int[] partR = new int[sequence.length - center];
        System.arraycopy(sequence, 0, partL, 0, center);
        System.arraycopy(sequence, center, partR, 0, sequence.length - center);
        return combineHalves(divideAndSort(partL), divideAndSort(partR));
    }

    public int[] runMergeSort() {
        if (this.rawItems.length > 1) {
            this.rawItems = divideAndSort(this.rawItems);
        }
        return this.rawItems;
    }

    public boolean isMonotonic() {
        for (int p = 0; p < this.rawItems.length - 1; p++) {
            if (this.rawItems[p] > this.rawItems[p + 1]) return false;
        }
        return true;
    }
}
