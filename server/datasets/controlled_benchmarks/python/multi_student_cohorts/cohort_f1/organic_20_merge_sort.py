# Organic MergeSort Student Submission 20
def natural_merge_sort(arr):
    if len(arr) <= 1: return arr
    runs = []
    current_run = [arr[0]]
    for i in range(1, len(arr)):
        if arr[i] >= arr[i - 1]:
            current_run.append(arr[i])
        else:
            runs.append(current_run)
            current_run = [arr[i]]
    runs.append(current_run)
    
    while len(runs) > 1:
        new_runs = []
        for i in range(0, len(runs), 2):
            if i + 1 < len(runs):
                r1, r2 = runs[i], runs[i + 1]
                m = []
                p1 = p2 = 0
                while p1 < len(r1) and p2 < len(r2):
                    if r1[p1] <= r2[p2]:
                        m.append(r1[p1]); p1 += 1
                    else:
                        m.append(r2[p2]); p2 += 1
                m.extend(r1[p1:])
                m.extend(r2[p2:])
                new_runs.append(m)
            else:
                new_runs.append(runs[i])
        runs = new_runs
    return runs[0]
