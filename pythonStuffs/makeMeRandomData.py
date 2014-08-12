from pandas import read_csv
import pandas as pd
import random

def getRandLatLon():
    """Grabs a random lat lon pair roughly inside the US
    """
    return (random.uniform(26,49), random.uniform(-124,-73))

def randomGeoData(fileName, howManyPoints):
    
    columns = ["lat", "lon",]
    index = range(howManyPoints)
    df = pd.DataFrame(index = index, columns=columns)
    
    for i in range(howManyPoints): 
        df.ix[i]["lat"] = getRandLatLon()[0]
        df.ix[i]["lon"] = getRandLatLon()[1]
    
    df.to_csv(fileName + '.csv')
    #df.to_json(orient='index',fileName + '.json')
    
randomGeoData("randomGeoData", 95)
