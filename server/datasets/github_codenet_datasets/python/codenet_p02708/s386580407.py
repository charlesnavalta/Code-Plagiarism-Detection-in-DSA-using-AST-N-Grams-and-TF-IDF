N, K = map(int, input().split())

result = 1
for i in range(K, N+1):
    tmp_min = (i - 1) * i // 2
    tmp_max = (N * (N + 1) - (N - i) * (N - i + 1)) // 2
    result += tmp_max - tmp_min + 1
    result %= 10 ** 9 + 7

print(result)

