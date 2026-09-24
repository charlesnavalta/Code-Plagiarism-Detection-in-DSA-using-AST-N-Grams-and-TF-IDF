# Organic BST Student Submission 03
class GeneratorBST:
    class Node:
        def __init__(self, v): self.v = v; self.l = None; self.r = None
    
    def __init__(self): self.root = None

    def insert(self, v):
        if not self.root: self.root = self.Node(v); return
        curr = self.root
        while True:
            if v < curr.v:
                if not curr.l: curr.l = self.Node(v); break
                curr = curr.l
            elif v > curr.v:
                if not curr.r: curr.r = self.Node(v); break
                curr = curr.r
            else: break

    def traverse(self, node=None):
        if node is None and self.root: node = self.root
        if node:
            if node.l: yield from self.traverse(node.l)
            yield node.v
            if node.r: yield from self.traverse(node.r)
