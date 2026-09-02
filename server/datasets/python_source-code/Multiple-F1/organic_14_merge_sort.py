# Organic MergeSort Student Submission 14
from collections import deque

def queue_based_mergesort(data):
    if len(data) <= 1:
        return data
    q = deque([[x] for x in data])
    while len(q) > 1:
        l1 = q.popleft()
        l2 = q.popleft()
        res = []
        i = j = 0
        while i < len(l1) and j < len(l2):
            if l1[i] <= l2[j]:
                res.append(l1[i]); i += 1
            else:
                res.append(l2[j]); j += 1
        res.extend(l1[i:])
        res.extend(l2[j:])
        q.append(res)
    return q[0] if q else []
