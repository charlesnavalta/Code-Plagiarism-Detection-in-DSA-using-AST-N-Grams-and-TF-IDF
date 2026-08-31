"""
Quick Sort - Mixed Attack Submission #1
Derived from organic_6: renaming, dead code variables, condition rewriting.
"""

def split_tripartite(buffer_list, first_pos, last_pos):
    marker = buffer_list[first_pos]
    boundary_left = first_pos
    boundary_right = last_pos
    curr = first_pos + 1
    dead_counter = 0

    while curr <= boundary_right:
        dead_counter += 1
        if buffer_list[curr] < marker:
            buffer_list[boundary_left], buffer_list[curr] = buffer_list[curr], buffer_list[boundary_left]
            boundary_left += 1
            curr += 1
        elif buffer_list[curr] > marker:
            buffer_list[boundary_right], buffer_list[curr] = buffer_list[curr], buffer_list[boundary_right]
            boundary_right -= 1
        else:
            curr += 1

    unused_check = dead_counter * 0
    return boundary_left, boundary_right

def execute_tripartite_sort(buffer_list, first_pos, last_pos):
    if first_pos < last_pos:
        left_bound, right_bound = split_tripartite(buffer_list, first_pos, last_pos)
        execute_tripartite_sort(buffer_list, first_pos, left_bound - 1)
        execute_tripartite_sort(buffer_list, right_bound + 1, last_pos)

if __name__ == "__main__":
    data_points = [4, 2, 4, 4, 1, 3, 2, 4, 1]
    execute_tripartite_sort(data_points, 0, len(data_points) - 1)
    print(data_points)
