// QuickSort Suite: Renamed Identifiers
// Author: Darrel (renamed_1.java - Type 2 of Mary)
public class ArraySorterEngine {
    private int[] elements;
    private int cmpCount;
    private int swapCount;

    public ArraySorterEngine(int[] rawItems) {
        this.elements = (rawItems != null) ? rawItems.clone() : new int[0];
        this.cmpCount = 0;
        this.swapCount = 0;
    }

    private int choosePivotIndex(int[] items, int startPos, int endPos) {
        int centerPos = startPos + (endPos - startPos) / 2;
        int valA = items[startPos], valB = items[centerPos], valC = items[endPos];
        if ((valA <= valB && valB <= valC) || (valC <= valB && valB <= valA)) return centerPos;
        if ((valB <= valA && valA <= valC) || (valC <= valA && valA <= valB)) return startPos;
        return endPos;
    }

    private int divideSegment(int[] items, int startPos, int endPos) {
        int pIndex = choosePivotIndex(items, startPos, endPos);
        int swapTmp = items[pIndex];
        items[pIndex] = items[endPos];
        items[endPos] = swapTmp;
        this.swapCount++;
        
        int pivotVal = items[endPos];
        int marker = startPos - 1;
        for (int scan = startPos; scan < endPos; scan++) {
            this.cmpCount++;
            if (items[scan] <= pivotVal) {
                marker++;
                int exchange = items[marker];
                items[marker] = items[scan];
                items[scan] = exchange;
                this.swapCount++;
            }
        }
        int boundary = items[marker + 1];
        items[marker + 1] = items[endPos];
        items[endPos] = boundary;
        this.swapCount++;
        return marker + 1;
    }

    private void executeSubSort(int[] items, int startPos, int endPos) {
        if (startPos < endPos) {
            int border = divideSegment(items, startPos, endPos);
            executeSubSort(items, startPos, border - 1);
            executeSubSort(items, border + 1, endPos);
        }
    }

    public int[] executeSort(boolean mutateDirect) {
        int[] workArray = mutateDirect ? this.elements : this.elements.clone();
        if (workArray.length > 1) {
            executeSubSort(workArray, 0, workArray.length - 1);
        }
        return workArray;
    }

    public boolean checkMonotonicity() {
        for (int idx = 0; idx < this.elements.length - 1; idx++) {
            if (this.elements[idx] > this.elements[idx + 1]) return false;
        }
        return true;
    }
}
