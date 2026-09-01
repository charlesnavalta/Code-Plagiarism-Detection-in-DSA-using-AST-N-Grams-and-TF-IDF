def maxSubArray(nums):
    def findBest(arr, l, r):
        if l > r: return float('-inf')
        if l == r: return arr[l]
        mid = (l + r) // 2
        
        left_max = curr = 0
        for i in range(mid - 1, l - 1, -1):
            curr += arr[i]
            left_max = max(left_max, curr)
            
        right_max = curr = 0
        for i in range(mid + 1, r + 1):
            curr += arr[i]
            right_max = max(right_max, curr)
            
        best_cross = left_max + arr[mid] + right_max
        return max(findBest(arr, l, mid - 1), findBest(arr, mid + 1, r), best_cross)
        
    return findBest(nums, 0, len(nums) - 1)
