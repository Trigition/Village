#!/usr/bin/env python

import requests
import pandas as pd
from FIPS_Reference import FIPS_Reference

# Load American POSTAL data
columns = ["country", "better_fips", "name", "state", "state_code", "county", "county_code", "subdivision",\
        "subdivision_code", "latitude", "longitude", "accuracy"]
#data = pd.read_csv("US.txt", sep="\t", header=None, names=columns)
data = pd.read_table("US.txt", header=None, names=columns)
# print data.loc[data["state_code"] == 'CA']
print data[:1]
def get_data(row, year, param_code):
    params = {}
    params["Query Type"] = "rawData"
    params["Output Format"] = "AQCVS"
    params["Parameter Code"] = param_code
    params["Begin Date"] = str(year) + "0101"
    params["End Date"] = str(year + 1) + "0101"
    params["State Code"] = FIPS_Reference[row['state_code']]
    params["County Code"] = '%03d' % int(row['county_code'])
    print params

r = requests.get("https://aqs.epa.gov/api", auth=("william.c.fong@gmail.com ", "saffronfrog61"))
get_data(data[:1],0,0)
#print r.status_code
