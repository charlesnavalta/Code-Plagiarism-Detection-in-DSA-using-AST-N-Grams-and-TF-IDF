"""
Quick Sort - Renamed Submission #2
Derived from organic_3: renamed variables.
"""

def split_first(vec, start, finish):
    key = vec[start]
    mark = start
    for k in range(start + 1, finish + 1):
        if vec[k] < key:
            mark += 1
            vec[mark], vec[k] = vec[k], vec[mark]
    vec[start], vec[mark] = vec[mark], vec[start]
    return mark

def sort_first(vec, start, finish):
    if start < finish:
        pos = split_first(vec, start, finish)
        sort_first(vec, start, pos - 1)
        sort_first(vec, pos + 1, finish)

if __name__ == "__main__":
    elements = [38, 27, 43, 3, 9, 82, 10]
    sort_first(elements, 0, len(elements) - 1)
    print(elements)
