# Organic Student Submission 23: Independent Algorithm Paradigm
class QuickSortEngineWithAudit:
    def __init__(self, dataset):
        self.dataset = list(dataset)
        self.history = []

    def log_event(self, action, a, b):
        self.history.append((action, a, b))

    def partition_segment(self, start, end):
        pivot = self.dataset[end]
        idx = start - 1
        for cursor in range(start, end):
            if self.dataset[cursor] <= pivot:
                idx += 1
                self.dataset[idx], self.dataset[cursor] = self.dataset[cursor], self.dataset[idx]
                self.log_event("swap", idx, cursor)
        self.dataset[idx + 1], self.dataset[end] = self.dataset[end], self.dataset[idx + 1]
        self.log_event("pivot_placed", idx + 1, end)
        return idx + 1

    def execute(self, start=0, end=None):
        if end is None: end = len(self.dataset) - 1
        if start < end:
            p = self.partition_segment(start, end)
            self.execute(start, p - 1)
            self.execute(p + 1, end)
        return self.dataset
