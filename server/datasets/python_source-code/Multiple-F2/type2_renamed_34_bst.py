class BinaryElement_34:
    def __init__(self, item_key=0, ptr_l=None, ptr_r=None):
        self.item_key = item_key
        self.ptr_l = ptr_l
        self.ptr_r = ptr_r

class BinarySearchManager_34:
    def __init__(self):
        self.tree_origin = None

    def add_key(self, item_key):
        if not self.tree_origin:
            self.tree_origin = BinaryElement_34(item_key)
            return self.tree_origin
        ptr_walker = self.tree_origin
        while True:
            if item_key < ptr_walker.item_key:
                if not ptr_walker.ptr_l:
                    ptr_walker.ptr_l = BinaryElement_34(item_key)
                    break
                ptr_walker = ptr_walker.ptr_l
            else:
                if not ptr_walker.ptr_r:
                    ptr_walker.ptr_r = BinaryElement_34(item_key)
                    break
                ptr_walker = ptr_walker.ptr_r
        return self.tree_origin

    def contains_key(self, item_key):
        ptr_walker = self.tree_origin
        while ptr_walker:
            if ptr_walker.item_key == item_key:
                return True
            ptr_walker = ptr_walker.ptr_l if item_key < ptr_walker.item_key else ptr_walker.ptr_r
        return False

    def export_inorder(self):
        output_buffer = []
        def depth_scan(element_ptr):
            if element_ptr:
                depth_scan(element_ptr.ptr_l)
                output_buffer.append(element_ptr.item_key)
                depth_scan(element_ptr.ptr_r)
        depth_scan(self.tree_origin)
        return output_buffer
