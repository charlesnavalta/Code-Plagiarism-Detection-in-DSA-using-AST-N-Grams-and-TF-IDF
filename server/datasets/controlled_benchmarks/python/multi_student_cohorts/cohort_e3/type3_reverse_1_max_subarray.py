def maxSubArray(nums):
    n = len(nums)
    max_sum = nums[n-1]
    current_sum = nums[n-1]
    
    for i in range(n-2, -1, -1):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
        
    return max_sum
