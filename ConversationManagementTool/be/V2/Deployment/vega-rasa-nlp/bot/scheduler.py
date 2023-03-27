import schedule
import time
import requests
import json
import redis
import os
from datetime import datetime
from datetime import date
from datetime import timedelta
import time
from duckling import Duckling, Dim, Language
duck     = Duckling()
duck.load()


r = redis.Redis(host=os.getenv('REDIS_EXTERNAL_SERVICE_HOST'), port= os.getenv('REDIS_EXTERNAL_SERVICE_PORT'), decode_responses=True)
print(r)
dev_apiKey= os.getenv('bearer_token')
print(dev_apiKey)
host = os.getenv('domain_name')
print(host)
spv_dev_host = 'spv.'+os.getenv('domain_name')
print(spv_dev_host)
#spv_dev_host = 'spv.igot-dev.in'
date = "last 6 months"



def getDates(date):
    duckObj = duck.parse(date)
    startDate = ''
    endDate = ''
    dates = {}
    #print(duckObj)
    if len(duckObj) > 0:
        #print(duckObj)
        print("===")
    for dobject in duckObj:
        #print(dobject)
        if dobject["dim"] == 'time':
            #print(dobject["body"])
            val = dobject["body"]
            if dobject["value"]["type"] == 'interval':
                startDate = (dobject["value"]["from"]["value"]).split("T")[0]
                endDate = (dobject["value"]["to"]["value"]).split("T")[0]
                startDate = datetime.strptime(startDate, "%Y-%m-%d")
                endDate = datetime.strptime(endDate, "%Y-%m-%d")
                startDate = round(datetime.timestamp(startDate)*1000)
                endDate = round(datetime.timestamp(endDate)*1000)
                #grain = dobject["value"]["type"]["from"]["grain"]
            else:
                startDate = (dobject["value"]["value"]).split("T")[0]
                endDate = (dobject["value"]["value"]).split("T")[0]
                startDate = round(datetime.datetime.timestamp(startDate)*1000)
                endDate = round(datetimetimestamp(endDate)*1000)
                #grain = dobject["value"]["grain"]
    dates["startDate"] = startDate
    dates["endDate"] = endDate
    return dates

def job():
    print("Running scheduler to make api calls at 3 am everyday")
    headers={'Authorization': dev_apiKey}
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"spvdashboard","visualizationType":"CHART","visualizationCode":"vspvcp1", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    #print(response.text)
    results = json.loads(response.text)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            details = json.dumps(details)
            details = details.replace("None", '"None"')
            r.set("top10coursesByrating", details)
    print("Done with first")
    payload1 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"spvdashboard","visualizationType":"CHART","visualizationCode":"vspv991", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response1 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload1)
    #print(response1.text)
    results1 = json.loads(response1.text)
    if(results1["statusInfo"]["statusCode"] == 200):
        if(len(results1["responseData"]) > 0):
            details1 = results1["responseData"]
            details1 = json.dumps(details1)
            details1 = details1.replace("None", '"None"')
            r.set("top10coursesBycompletion", details1)
    print("Done with second")
    payload2 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART","visualizationCode":"voverviewpe21", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response2 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload2)
    #print(response2.text)
    results2 = json.loads(response2.text)
    if(results2["statusInfo"]["statusCode"] == 200):
        if(len(results2["responseData"]) > 0):
            details2 = results2["responseData"]
            details2 = json.dumps(details2)
            details2 = details2.replace("None", '"None"')
            r.set("top10mdosByusersOnboard", details2)
    print("Done with third")
    payload3 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"spvdashboard","visualizationType":"CHART","visualizationCode":"vspv992", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response3 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload3)
    #print(response3.text)
    results3 = json.loads(response3.text)
    if(results3["statusInfo"]["statusCode"] == 200):
        if(len(results3["responseData"]) > 0):
            details3 = results3["responseData"]
            details3 = json.dumps(details3)
            details3 = details3.replace("None", '"None"')
            r.set("top10mdosBycompletion", details3)
    print("Done with fourth")
    payload4 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART","visualizationCode":"voverviewcp63", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response4 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload4)
    #print(response4.text)
    results4 = json.loads(response4.text)
    if(results4["statusInfo"]["statusCode"] == 200):
        if(len(results4["responseData"]) > 0):
            details4 = results4["responseData"]
            details4 = json.dumps(details4)
            details4 = details4.replace("None", '"None"')
            r.set("top10mdosByliveCourses", details4)
    print("Done with fifth")
    payload5 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"ceodashboards", "visualizationType":"METRIC", "visualizationCode":"vcbp999", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response5 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload5)
    #print(response5.text)
    results5 = json.loads(response5.text)
    if(results5["statusInfo"]["statusCode"] == 200):
        if(len(results5["responseData"]) > 0):
            details5 = results5["responseData"]
            details5 = json.dumps(details5)
            details5 = details5.replace("None", '"None"')
            r.set("cbpProviderleaderBoard", details5)
    print("Done with sixth")
    payload6 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"spvdashboard","visualizationType":"METRIC", "visualizationCode":"vspv307", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response6 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload6)
    #print(response6.text)
    results6 = json.loads(response6.text)
    if(results6["statusInfo"]["statusCode"] == 200):
        if(len(results6["responseData"]) > 0):
            details6 = results6["responseData"]
            details6 = json.dumps(details6)
            details6 = details6.replace("None", '"None"')
            r.set("userEngagementbyHubs", details6)
    print("Done with seventh")
    print("The api call is doneeeee")
    
#job()



#schedule.every().seconds.do(job)
#schedule.every().day.at("09:00").do(job)
#while True:
#    schedule.run_pending()
#    time.sleep(1)
