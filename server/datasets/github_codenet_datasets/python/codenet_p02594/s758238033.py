import sys
#DEBUG=True
DEBUG=False
if DEBUG:
    f=open("A_input.txt")
else:
    f=sys.stdin
N=int(f.readline().strip())
print("Yes") if N>=30 else print("No")
f.close()