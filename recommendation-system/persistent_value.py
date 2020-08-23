#!/usr/bin/env python3

from constant import PERSISTENT_VALUE_FILE_PATH
import os

def read():
    if not os.path.isfile(PERSISTENT_VALUE_FILE_PATH):
        return {}
    with open(PERSISTENT_VALUE_FILE_PATH) as ifh:
        return dict(line.rsplit(None, 1) for line in ifh)

PersistentValues = read()

def write(values):
    with open(PERSISTENT_VALUE_FILE_PATH, 'w') as f: 
        for key, value in values.items(): 
            f.write('%s %s\n' % (key, value)) 

