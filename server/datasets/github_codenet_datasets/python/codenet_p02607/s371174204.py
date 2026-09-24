n = int(input())
li_a = list(map(int, input().split()))
answer = 0
for idx, v in enumerate(li_a, start=1):
    if idx %2 != 0 and v %2 != 0:
        answer += 1
print(answer)
