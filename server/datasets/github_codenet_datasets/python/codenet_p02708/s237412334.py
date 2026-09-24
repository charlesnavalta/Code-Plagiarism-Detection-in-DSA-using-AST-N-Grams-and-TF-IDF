N,K = map(int,input().split())
number = N+1-K+1
W = 0
for i in range(number):
    min = (K+i)*(K+i-1)/2
    max = (K+i)*(2*N-K-i+1)/2
    W += (max-min+1)
w = W % (1000000007)
print(int(w))