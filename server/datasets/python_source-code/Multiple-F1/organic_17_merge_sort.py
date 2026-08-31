def sort_array(seq_16):
    def divide(seq):
        if len(seq) < 2: return seq
        m = len(seq) // 2
        return combine(divide(seq[:m]), divide(seq[m:]))
    def combine(a, b):
        merged = []
        while a and b:
            merged.append(a.pop(0) if a[0] < b[0] else b.pop(0))
        return merged + a + b
    return divide(seq_16)
