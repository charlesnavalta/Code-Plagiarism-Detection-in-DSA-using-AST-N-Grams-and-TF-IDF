import sys


def resolve(in_):
    mod = 1000000007  # 10 ** 9 + 7
    n, k = map(int, in_.readline().split())
    n += 1

    # ans = 0
    ans = 1
    # while n >= k:
    while n > k:
        ans += (
            ((n + (n - k)) * k // 2) % mod - 
            ((1 + k - 1) * k // 2) % mod +
            1
            ) % mod
        ans %= mod
        k += 1
    return ans


def main():
    answer = resolve(sys.stdin.buffer)
    print(answer)


if __name__ == '__main__':
    main()