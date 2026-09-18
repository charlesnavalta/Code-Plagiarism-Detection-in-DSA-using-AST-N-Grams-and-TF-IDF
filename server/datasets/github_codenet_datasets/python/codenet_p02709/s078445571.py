import math
import fractions
import collections
import itertools
import pprint
N=int(input())
A=list(map(int,input().split()))
que=[]
dp=[[0 for _ in range(N+1)] for _ in range(N+1)]    #dp[i][j]…左にiこ、みぎにjこあること状態になった時の最大をいれる
for i in range(N):
    que.append([A[i],i])
que.sort(key=lambda x:x[0],reverse=True)
#pprint.pprint(dp)
#print(que)
for i in range(0,N+1):
    if i!=0:
        for j in range(i+1):
            if j==0:#dp[i][0],左にiこつまる状態に
                dp[i-j][j]=dp[i-j-1][j]+(que[i-1][0]*abs((i-1)-que[i-1][1]))
            elif j==i:#dp[0][i],みぎにiこ詰まる状態に
                dp[i-j][j]=dp[i-j][j-1]+(que[i-1][0]*abs(N-j-que[i-1][1]))
            else:
                dp[i-j][j]=max(dp[i-j-1][j]+(que[i-1][0]*abs(((i-1)-j)-que[i-1][1])),dp[i-j][j-1]+(que[i-1][0]*abs(N-j-que[i-1][1])))
        #input()
        #pprint.pprint(dp)
ma=0
for i in range(0,N+1):
    #print(dp[N-i][i])
    ma=max(ma,dp[N-i][i])
print(ma)


"""
st=[-1]*N
en=[-1]*N
s=[[0,[0,0]] for _ in range(N*N)]
for i in range(N):
    for j in range(N):
        s[i*N+j][0]=A[i]*abs(i-j)
        s[i*N+j][1][0]=i
        s[i*N+j][1][1] = j
s.sort(key=lambda x:x[0],reverse=True)
print(s)
cnt=0
for i in range(len(s)):
    a=s[i][1][0]
    b=s[i][1][1]
    c=s[i][0]
    if (st[a]==-1)and(en[b]==-1):
        cnt=cnt+c
        st[a]=0
        en[b]=0
print(cnt)
"""
