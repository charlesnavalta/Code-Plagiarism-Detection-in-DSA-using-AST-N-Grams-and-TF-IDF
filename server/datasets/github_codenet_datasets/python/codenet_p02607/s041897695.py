import sys
readline = sys.stdin.buffer.readline

N=int(readline())
a=list(map(int, readline().split()))
cnt=0
for i in range(0,N,2):
  if a[i]%2==1:
    cnt+=1
print(cnt)