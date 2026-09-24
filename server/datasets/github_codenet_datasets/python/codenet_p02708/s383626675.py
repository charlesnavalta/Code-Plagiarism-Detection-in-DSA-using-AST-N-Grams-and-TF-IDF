import sys
MOD = 10**9 + 7


def sum_from_to(fr, to):
    return (to - fr + 1) * (fr + to) // 2 % MOD


def main():
    input = sys.stdin.buffer.readline
    n, k = map(int, input().split())
    ans = 0
    for i in range(k, n + 2):
        ans += sum_from_to(n - i + 1, n) - sum_from_to(0, i - 1) + 1
        ans %= MOD
    print(ans)


if __name__ == '__main__':
    main()
