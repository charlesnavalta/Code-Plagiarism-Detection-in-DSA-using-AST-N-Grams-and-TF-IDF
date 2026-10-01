def sift_down_bitwise(nums, n, i):
    best = i
    l = (i << 1) + 1
    r = (i << 1) + 2
    if r < n and nums[r] > nums[best]:
        best = r
    if l < n and nums[l] > nums[best]:
        best = l
    if best != i:
        temp = nums[i]
        nums[i] = nums[best]
        nums[best] = temp
        sift_down_bitwise(nums, n, best)

def heap_sort(nums):
    n = len(nums)
    for k in range(n // 2 - 1, -1, -1):
        sift_down_bitwise(nums, n, k)
    idx = n - 1
    while idx > 0:
        nums[idx], nums[0] = nums[0], nums[idx]
        sift_down_bitwise(nums, idx, 0)
        idx -= 1
    return nums
