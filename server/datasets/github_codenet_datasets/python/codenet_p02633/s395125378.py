import bisect,collections,copy,heapq,itertools,math,string
import sys
def S(): return sys.stdin.readline().rstrip()
def M(): return map(int,sys.stdin.readline().rstrip().split())
def I(): return int(sys.stdin.readline().rstrip())
def LI(): return list(map(int,sys.stdin.readline().rstrip().split()))
def LS(): return list(sys.stdin.readline().rstrip().split())
x = I()
ans = 0
wa = 0
cont = True
while cont:
    wa += x
    ans += 1
    if wa % 360 == 0:
        cont = False
print(ans)