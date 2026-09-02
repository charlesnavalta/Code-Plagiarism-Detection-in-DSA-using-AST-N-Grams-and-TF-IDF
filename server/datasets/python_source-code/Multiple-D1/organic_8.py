# Organic Student Submission 8: Independent Algorithm Paradigm
class SorterWithComparator:
    def __init__(self, key_func=lambda x: x):
        self.key = key_func

    def partition(self, arr, start, end):
        pivot = self.key(arr[end])
        i = start - 1
        for j in range(start, end):
            if self.key(arr[j]) <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[end] = arr[end], arr[i + 1]
        return i + 1

    def sort(self, arr, start=0, end=None):
        if end is None: end = len(arr) - 1
        if start < end:
            p = self.partition(arr, start, end)
            self.sort(arr, start, p - 1)
            self.sort(arr, p + 1, end)
        return arr
