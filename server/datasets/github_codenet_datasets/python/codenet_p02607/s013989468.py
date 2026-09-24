n = int(input().rstrip())
num_list = [int(x) for x in input().rstrip().split(" ")]
count = 0
for i in range(0,n,2):
  count += num_list[i]%2!=0

print(count)