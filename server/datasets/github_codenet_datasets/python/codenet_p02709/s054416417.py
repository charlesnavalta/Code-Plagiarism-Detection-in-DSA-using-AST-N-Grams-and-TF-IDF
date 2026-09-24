# -*- coding: utf-8 -*-

N = int(input().strip())
A_list = list(map(int, input().rstrip().split()))
#-----

# A_index[i] = ( value of A , index of A)
A_index = [ (A_list[i], i) for i in range(len(A_list)) ]
A_index.sort(reverse=True)


# dp[left][right] = score
dp = [ [0]*(N+1) for _ in range(N+1) ]


for L in range(N):
    for R in range(N-L):
        i = L + R
        append_L = dp[L][R] + A_index[i][0] * abs(L - A_index[i][1])
        append_R = dp[L][R] + A_index[i][0] * abs((N-1-R) - A_index[i][1])
        
        dp[L+1][R] = max(dp[L+1][R], append_L)
        dp[L][R+1] = max(dp[L][R+1], append_R)


ans = max( [ dp[i][N-i] for i in range(N+1)] )
print(ans)
