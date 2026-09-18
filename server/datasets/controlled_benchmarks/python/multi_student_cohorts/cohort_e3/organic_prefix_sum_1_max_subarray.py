def maxSubArray(nums):
    max_sum = float('-inf')
    current_prefix = 0
    min_prefix = 0
    
    for num in nums:
        current_prefix += num
        if current_prefix - min_prefix > max_sum:
            max_sum = current_prefix - min_prefix
        if current_prefix < min_prefix:
            min_prefix = current_prefix
            
    return max_sum
