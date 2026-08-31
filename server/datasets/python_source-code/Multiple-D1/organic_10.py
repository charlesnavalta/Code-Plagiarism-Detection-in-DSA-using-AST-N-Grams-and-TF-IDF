"""
Quick Sort - Organic Submission #10
Encapsulated Object-Oriented QuickSorter class.
"""

class QuickSorter:
    def __init__(self, data):
        self.data = list(data)

    def _partition(self, low, high):
        pivot = self.data[high]
        i = low - 1
        for j in range(low, high):
            if self.data[j] <= pivot:
                i += 1
                self.data[i], self.data[j] = self.data[j], self.data[i]
        self.data[i + 1], self.data[high] = self.data[high], self.data[i + 1]
        return i + 1

    def _sort(self, low, high):
        if low < high:
            pi = self._partition(low, high)
            self._sort(low, pi - 1)
            self._sort(pi + 1, high)

    def sort(self):
        self._sort(0, len(self.data) - 1)
        return self.data

if __name__ == "__main__":
    sorter = QuickSorter([5, 2, 9, 1, 7, 6, 3])
    print(sorter.sort())
