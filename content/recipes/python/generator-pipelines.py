"""
title: Creating data pipelines with generators
"""

# example from https://realpython.com/introduction-to-python-generators
from pprint import pprint

data = """
permalink,company,numEmps,city,state,raisedAmt,round
digg,Digg,60,San Francisco,CA,8500000,b
digg,Digg,60,San Francisco,CA,2800000,a
facebook,Facebook,450,Palo Alto,CA,500000,angel
facebook,Facebook,450,Palo Alto,CA,12700000,a
photobucket,Photobucket,60,Palo Alto,CA,3000000,a
"""


def read_data(data, delim=","):
    for line in data.split("\n"):
        if line.strip():
            yield line.strip().split(delim)


lines = read_data(data)
cols = next(lines)
df = (dict(zip(cols, data)) for data in lines)

pprint(next(df), indent=2)
