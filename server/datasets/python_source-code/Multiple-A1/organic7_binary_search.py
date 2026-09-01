"""
Binary Search Suite - Submission by Ramon
Approach: Object-oriented BinarySearchEngine class encapsulating dataset,
caching results, and providing analytical summary methods.
"""


class BinarySearchEngine:
    def __init__(self, dataset):
        self.data = dataset
        self.length = len(dataset)
        self.query_history = []

    def find(self, target):
        lo, hi = 0, self.length - 1
        comps = 0
        while lo <= hi:
            comps += 1
            mid = (lo + hi) // 2
            val = self.data[mid]
            if val == target:
                self.query_history.append((target, mid, comps))
                return mid
            elif val < target:
                lo = mid + 1
            else:
                hi = mid - 1
        self.query_history.append((target, -1, comps))
        return -1

    def count_matches(self, target):
        pos = self.find(target)
        if pos == -1:
            return 0
        left = pos
        while left > 0 and self.data[left - 1] == target:
            left -= 1
        right = pos
        while right < self.length - 1 and self.data[right + 1] == target:
            right += 1
        return (right - left) + 1

    def summary(self):
        return {"total_queries": len(self.query_history), "history": self.query_history}


if __name__ == "__main__":
    arr = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    engine = BinarySearchEngine(arr)
    print("Index:", engine.find(12))
    print("Matches:", engine.count_matches(12))
    print("Summary:", engine.summary())
