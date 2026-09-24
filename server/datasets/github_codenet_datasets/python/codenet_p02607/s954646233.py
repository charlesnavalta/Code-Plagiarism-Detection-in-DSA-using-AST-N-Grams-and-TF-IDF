def main():
    N = int(input())
    A = [int(x) for x in input().split()]
    cnt = 0
    for i in range(N):
        if i % 2 == 0 and A[i] % 2 == 1:
            cnt += 1
    print(cnt)
 
if __name__ == '__main__':
    main()