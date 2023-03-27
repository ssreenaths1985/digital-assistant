from email.mime.text import MIMEText
from elasticsearch import Elasticsearch
import smtplib
import json
import requests
import re
import os
import pickle
import collections
import spacy
import redis
nlp = spacy.load('en_core_web_sm')
from datetime import datetime
from datetime import timedelta
import jwt
from duckling import Duckling, Dim, Language
nlp = spacy.load('en_core_web_sm')
duck     = Duckling()
duck.load()
dev_apiKey= os.getenv('bearer_token')
print(dev_apiKey)
host = os.getenv('domain_name')
print(host)
spv_dev_host = 'spv.'+os.getenv('domain_name')
print(spv_dev_host)
portalhost = 'portal.'+os.getenv('domain_name')
print(portalhost)
frac_host = 'frac.'+os.getenv('domain_name')
print(frac_host)
apiKey = os.getenv('bearer_token')
print(apiKey)
from oauth2client import file, client, tools
#from send_email import send_mail


r = redis.Redis(host=os.getenv('REDIS_EXTERNAL_SERVICE_HOST'), port= os.getenv('REDIS_EXTERNAL_SERVICE_PORT'), decode_responses=True)
print(r)
#r = redis.Redis(host = 'localhost', port= '6379', decode_responses=True)

def skillAvailiblity(text, sender, entities):
    if(len(entities) > 0):
        print("inside skills if")
        entity = entities[0]['value']
        print(entity)
    else:
        print("not identified")
        print(text)
        stopwords = ['do', 'fetch', 'we', 'have', 'competence', 'competency', 'consultants', 'show', 'consultant', 'me', 'the', 'developers', 'developer', 'skills', 'in', 'competency', 'with', 'skilled', 'skill', 'we', 'can', 'you']
        querywords = text.split()
        resultwords  = [word for word in querywords if word.lower() not in stopwords]
        entity = ' '.join(resultwords)
        print(entity)
    res = requests.post('https://kronos.tarento.com/api/v1/user/getUsersByData', headers={'Content-type': 'application/json', 'Authorization':sender}, json = {"skill": entity, "active": "true"})
    result = res.json()
    print(result)
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
            elements = [{"type":"employee_skills","entities":entities, "intent" : "skill_availability", "text" : str(len(details)) + " people are skilled in " +entity, "data": details, "statusCode": result['statusCode']}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "skill_availability", "statusCode": result['statusCode'], "text" : "Seems like we don't have consultants with skills in "+ entity +" at the moment."}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "skill_availability", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements



#################################################################### migrated apis START ######################################################################




def fetch_contact_details(name, session_id, entities):
    print(name)
    print(len(name))
    if (len(name.split()) > 1):
        firstname = name.spilt(" ")[0]
        lastname = name.split(" ")[1]
        data = []
        res = requests.get('https://igot-stage.in/api/user/v1/autocomplete/shasha', headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id})
        result = res.json()
        print(result)
        if result['responseCode'] == "OK":
            if(len(result["result"]["response"]["content"]) > 0):
                details = result['result']['content']
                for users in details:
                    if(users["firstName"].startsWith(firstname) and users["lastName"].startsWith(lastname)):
                        data.append(users)
                elements = [{"type":"contact","entities":entities, "intent" : "contact_details", "text" : "Here's what i found", "data": data, "statusCode": result['responseCode']}]
            else:
                elements = [{"type":"direct","entities":entities, "intent" : "contact_details", "text" : "Couldn't find "+name+" in the directory. Let's try again?", "statusCode": result['responseCode']}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "contact_details", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['responseCode']}]
    else:
        res = requests.get('https://'+host+'/api/user/v1/autocomplete/'+name, headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id})
        result = res.json()
        print(result)
        if result['responseCode'] == "OK":
            if(len(result["result"]["response"]["content"]) > 0):
                details =  result["result"]["response"]["content"]
                elements = [{"type":"contact", "intent" : "contact_details", "text" : "Here's what i found", "data":details, "statusCode": result['responseCode']}]
            else:
                elements = [{"type":"direct", "intent" : "contact_details", "text" : "Couldn't find "+name+" in the directory. Let's try again?", "statusCode": result['responseCode']}]
        else:
            elements = [{"type":"direct", "intent" : "contact_details", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['responseCode']}] 
    return elements



def get_recent_content(text, entities, session_id):
    #if(len(entities) > 0):
        #entity = entities[0]['value']
        #print(entity)
    #else:
        #print("not identified")
        #stopwords = ['get', 'fetch', 'give', 'show', 'share', 'me', 'a', 'on', 'with', 'details', 'the', 'doc', 'document', 'docs', 'file', 'deck', 'ppt', 'presentation', 'files', 'provide', 'need', 'can', 'you']
        #querywords = text.split()
        #resultwords  = [word for word in querywords if word.lower() not in stopwords]
        #entity = ' '.join(resultwords)
        #print(entity)
    print('https://'+host+'/api/composite/v1/search')
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    payload = {"request": {"filters":{"visibility":["Default"],"contentType":["Course"]},"query": "" , "sort_by":{"lastUpdatedOn":"desc"},"fields":["name","appIcon","instructions","description","purpose","mimeType","gradeLevel","identifier","medium","pkgVersion","board","subject","resourceType","primaryCategory","contentType","channel","organisation","trackable","license","posterImage","idealScreenSize","learningMode","creatorLogo","duration"],"facets":[]}}
    response = requests.post('https://'+host+'/api/composite/v1/search', headers=headers, json = payload)
    print(response)
    results = json.loads(response.text)
    if(results["responseCode"] == "OK"):
        if(len(results["result"]["content"]) > 0):
            details = results["result"]["content"]
            elements = [{"type":"course","entities":entities, "intent" : "recent_content", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "recent_content", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": results["responseCode"]}]
    else:
        elements = [{"type":"direct", "intent" : "recent_content", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    return elements
    
    
def getDates(date):
    duckObj = duck.parse(date)
    startDate = ''
    endDate = ''
    dates = {}
    print(duckObj)
    if len(duckObj) > 0:
        print(duckObj)
    for dobject in duckObj:
        print(dobject)
        if dobject["dim"] == 'time':
            print(dobject["body"])
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
    
    
def get_recent_discussions(text, entities, uid, session_id):
    #if(len(entities) > 0):
        #entity = entities[0]['value']
        #print(entity)
    #else:
        #print("not identified")
        #stopwords = ['get', 'fetch', 'give', 'show', 'share', 'me', 'a', 'on', 'with', 'details', 'the', 'doc', 'document', 'docs', 'file', 'deck', 'ppt', 'presentation', 'files', 'provide', 'need', 'can', 'you']
        #querywords = text.split()
        #resultwords  = [word for word in querywords if word.lower() not in stopwords]
        #entity = ' '.join(resultwords)
        #print(entity)
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    response = requests.get('https://'+host+'/api/discussion/recent?page=1&_uid='+uid, headers=headers)
    results = json.loads(response.text)
    if(len(results["topics"]) > 0):
        details = results["topics"]
        elements = [{"type":"discussions","entities":entities, "intent" : "recent_discussions", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "recent_discussions", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    return elements
    
def get_trending_discussions_posts(text, entities, uid, session_id):
    #if(len(entities) > 0):
        #entity = entities[0]['value']
        #print(entity)
    #else:
        #print("not identified")
        #stopwords = ['get', 'fetch', 'give', 'show', 'share', 'me', 'a', 'on', 'with', 'details', 'the', 'doc', 'document', 'docs', 'file', 'deck', 'ppt', 'presentation', 'files', 'provide', 'need', 'can', 'you']
        #querywords = text.split()
        #resultwords  = [word for word in querywords if word.lower() not in stopwords]
        #entity = ' '.join(resultwords)
        #print(entity)
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    response = requests.get('https://'+host+'/api/discussion/popular?page=1&_uid='+uid, headers=headers)
    results = json.loads(response.text)
    if(len(results["topics"]) > 0):
        details = results["topics"]
        elements = [{"type":"discussions","entities":entities, "intent" : "trending_discussions", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "trending_discussions", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    return elements



def get_upvoted_discussions(text, entities, uid, username, session_id):
    #if(len(entities) > 0):
        #entity = entities[0]['value']
        #print(entity)
    #else:
        #print("not identified")
        #stopwords = ['get', 'fetch', 'give', 'show', 'share', 'me', 'a', 'on', 'with', 'details', 'the', 'doc', 'document', 'docs', 'file', 'deck', 'ppt', 'presentation', 'files', 'provide', 'need', 'can', 'you']
        #querywords = text.split()
        #resultwords  = [word for word in querywords if word.lower() not in stopwords]
        #entity = ' '.join(resultwords)
        #print(entity)
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    response = requests.get('https://'+host+'/api/discussion/user/'+username+'/upvoted?_uid='+uid, headers=headers)
    results = json.loads(response.text)
    print(results)
    if(results["counts"]["upvoted"] > 0):
        details = results["posts"]
        elements = [{"type":"discussions","entities":entities, "intent" : "upvoted_discussions", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "upvoted_discussions", "text" : "Seems like you haven't upvoted any discussions.", "statusCode": 200}]
    return elements
    

def get_posts_with_tags(text, tag, uid, session_id):
    print(tag)
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    response = requests.get('https://'+host+'/api/discussion/tags/'+tag+'?page=1&_uid='+uid, headers=headers)
    print('https://'+host+'/api/discussion/tags/'+tag+'?page=1&_uid='+uid)
    print(response)
    results = json.loads(response.text)
    print(results)
    if 'topics' in results:
        if(len(results["topics"]) > 0):
            details = results["topics"]
            elements = [{"type":"discussions", "intent" : "post_tags", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 'OK'}]
        else:
            elements = [{"type":"direct", "intent" : "post_tags", "text" : "Seems like there are no discussions that are tagged to this particular tag", "statusCode": 'OK'}]
    else:
        elements = [{"type":"direct", "intent" : "post_tags", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": 'ERROR'}]
    return elements
    

def filter_content(text, entity, session_id):
# see if the entity is a competency, topic or providers
    payload = getFilter(session_id, entity)
    print(payload)
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    response = requests.post('https://'+host+'/api/composite/v1/search', headers=headers, json = payload)
    results = json.loads(response.text)
    print(results)
    if(results["responseCode"] == "OK"):
        if(len(results["result"]["content"]) > 0):
            details = results["result"]["content"]
            elements = [{"type":"course","entities":entities, "intent" : "filter_content", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "filter_content", "text" : "Seems like there is nothing matching to your query.", "statusCode": results["responseCode"]}]
    else:
        elements = [{"type":"direct", "intent" : "filter_content", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    return elements


def getFilter(session_id, entity):
    request = {}
    print("inside")
    providers = r.get('providers')
    print(providers)
    topics = r.get('topics')
    competencies = r.get('competencies')
    if providers == None:
        print("make api call and store in redis")
        headers = {"Authorization": apiKey, "x-authenticated-user-token": session_id}
        payload = {"request": { "filters": { "isCbp": True }, "sort_by": { "orgName": "asc" }, "limit": 1000 } }
        response = requests.post('https://'+frac_host+'/fracapis/frac/searchNodes', headers=headers, json = payload)
        results = json.loads(response.text)
        print(results)
        lists = [];
        result = []
        if (len(results["result"]["response"]["content"]) > 0):
            result = results["result"]["response"]["content"];
            for channels in result:
                lists.append(channels["channel"])
        providers = lists
        r.set("providers", providers)
    if topics == None:
        print("make api call and store in redis")
    if competencies == None:
        print("make api call and store in redis")
    if entity in providers:
        print("this is a provider")
        request = {"request": { "filters": { "contentType": ["Course"], "primaryCategory": [], "mimeType": [], "source": [entity], "mediaType": [], "status": ["Live"],}, "query": "", "sort_by": { "lastUpdatedOn": "" }, "fields": [], "facets": ["contentType", "mimeType", "source"] } }
    elif entity in topics:
        print("this is a topic")
        request = {"request": {"query": "", "filters": {"status": ["Live"],"contentType": ["Collection","Course","Learning Path"],"topics": identifier},"sort_by": {"lastUpdatedOn": "desc"},"facets": ["primaryCategory", "mimeType"]}}
    elif entity in competencies:
        print("this is a compeetncy")
        request = {"request": {"query": "","filters": {"primaryCategory": ["Course","Program"],"status": ["Live"],"competencies_v3.name": [entity]},"sort_by": {"name": "Asc"},"facets": ["competencies_v3.name", "competencies_v3.competencyType","taxonomyPaths_v2.name"], "fields": [], "limit": 10, "offset": 0}}
    else:
        print("This is a term search")
        request = {"request": { "filters": { "visibility": ["Default"], "contentType": ["Course"] }, "query": entity, "fields": [], "facets": [] } }
    return request


def competency_type_list(text, entity, session_id):
    headers={'Authorization':"bearer "+session_id}
    payload = {"searches":[{"type":"COMPETENCY","field":"name","keyword":""},{"type":"COMPETENCY","field":"status","keyword":"VERIFIED"}] }
    response = requests.post('https://'+frac_host+'/fracapis/frac/searchNodes', headers=headers, json = payload)
    results = json.loads(response.text)
    clist = []
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            for competency in details:
                if((competency["additionalProperties"]["competencyType"]).lower() == entity.lower()):
                    clist.append(competency)
            elements = [{"type":"competencylist", "intent" : "competency_type_list", "text" : "Here's what you were looking for!<br>", "data": clist, "statusCode": results["statusInfo"]["statusCode"]}]
        else:
            elements = [{"type":"direct", "intent" : "competency_type_list", "text" : "Seems like there are no competencies of a this type.", "statusCode": results["statusInfo"]["statusCode"]}]
    else:
        elements = [{"type":"direct", "intent" : "filter_content", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements


    
def cbp_matches_to_competency(text, wid, session_id):
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
# get my competency list
    clist = getCompetencyList(wid, session_id)
    print(clist)
    payload = {"request": {"query": "","filters": {"primaryCategory": ["Course","Program"],"status": ["Live"],"competencies_v3.name": clist},"sort_by": {"name": "Asc"},"facets": ["competencies_v3.name", "competencies_v3.competencyType","taxonomyPaths_v2.name"], "fields": [], "limit": 10, "offset": 0}}
    response = requests.post('https://'+host+'/api/composite/v1/search', headers=headers, json = payload)
    results = json.loads(response.text)
    if(results["responseCode"] == "OK"):
        if(len(results["result"]["content"]) > 0):
            details = results["result"]["content"]
            elements = [{"type":"course", "intent" : "cbp_matches_to_my_competencies", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct", "intent" : "cbp_matches_to_my_competencies", "text" : "Seems like there are no cbps matching to your competencies.", "statusCode": results["responseCode"]}]
    else:
        elements = [{"type":"direct", "intent" : "cbp_matches_to_my_competencies", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    return elements
    

def getCompetencyList(wid, session_id):
    print(wid)
    print(session_id)
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    payload = {"request": {"filters": { "userId": [wid]}}}
    response = requests.post('https://'+host+'/api/user/v1/search', headers=headers, json = payload)
    results = json.loads(response.text)
    competencies = []
    if(results["responseCode"] == "OK"):
        if(len(results["result"]["response"]["content"]) > 0):
            details = results["result"]["response"]["content"]
            if 'profileDetails' in details[0]:
                pdetails = details[0]['profileDetails']
                if 'competencies' in pdetails and (len(pdetails['competencies']) > 0):
                    clist = pdetails['competencies']
                    for c in clist:
                        competencies.append(c['name'])    
    return competencies
    

def course_learners(text, wid, course, session_id):
# get course id
    cid = getCourseId(course, session_id)
    print(cid)
    headers = {'rootOrg' : "igot", 'org': "dopt", 'resourceId': cid, 'Authorization': apiKey, "x-authenticated-user-token" : session_id, 'userUUID': wid}
    response = requests.get('https://'+host+'/api/v2/resources/user/cohorts/activeusers', headers=headers)
    results = json.loads(response.text)
    if(len(results) > 0):
        details = results
        elements = [{"type":"learners", "intent" : "learning_course", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct", "intent" : "learning_course", "text" : "Seems like nobody is taking this course right now", "statusCode": 200}]
    return elements
    
    
def getCourseId(course, session_id):
    cid = ''
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    payload = {"request": {"filters": {"contentType": [],"primaryCategory": ["course"],"source": []},"sort_by": {"lastUpdatedOn": "desc"},"fields": [],"status": ["Live"],"query": course}}
    response = requests.post('https://'+portalhost+'/api/composite/v1/search', headers=headers, json = payload)
    results = json.loads(response.text)
    #print(results)
    competencies = []
    if(results["responseCode"] == "OK"):
        if(len(results["result"]["content"]) > 0):
            details = results["result"]["content"]
            for courses in details:
                if courses["name"].lower() == course.lower():
                    cid = courses['IL_UNIQUE_ID']
    return cid
    
    
def competency_holders(text, competency, session_id):
# verify competency
    vcompetency = verifyCompetency(competency, session_id)
    print(vcompetency)
    if(vcompetency):
        headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
        payload = {"request": {"query": "", "filters": {"profileDetails.competencies.name": competency}}}
        response = requests.post('https://'+host+'/api/user/v1/search', headers=headers, json = payload)
        results = json.loads(response.text)
        if(results["responseCode"] == "OK"):
            if(len(results["result"]["response"]["content"]) > 0):
                details = results["result"]["response"]["content"]
                elements = [{"type":"contact", "intent" : "people_with_competency", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
            else:
                elements = [{"type":"direct", "intent" : "people_with_competency", "text" : "Seems like nobody is competent in this specific competency.", "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct", "intent" : "people_with_competency", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    else:
        elements=[{"type":"direct", "intent" : "people_with_competency", "text" : "Seems like this is not a verified competency.", "statusCode": 200}]     
    return elements
    
    
def verifyCompetency(comp, session_id):
    headers={'Authorization':"bearer "+session_id}
    payload = {"searches":[{"type":"COMPETENCY","field":"name","keyword":""},{"type":"COMPETENCY","field":"status","keyword":"VERIFIED"}] }
    response = requests.post('https://'+frac_host+'/fracapis/frac/searchNodes', headers=headers, json = payload)
    results = json.loads(response.text)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            for competency in details:
                if((competency["name"]).lower() == comp.lower()):
                    res = True
                    break
                else:
                    res = False
    return res
    
    
def get_courses_completed(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    duckObj = duck.parse(date)
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART","visualizationCode":"voverviewpe1501", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "courses_started", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "courses_started", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "courses_started", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements
    
    
    


def get_mdos_onboarded(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"METRIC","visualizationCode":"voverviewpe1", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "courses_started", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "courses_started", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "courses_started", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements



def get_courses_live_or_draft_or_review(text, entities, session_id):
    date = "last 1 year"
    status = ''
    startDate = ''
    endDate = ''
    plots = []
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
            if ent['entity'] == 'status':
                status = ent["value"]     
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"ceodashboards","visualizationType":"METRIC","visualizationCode":"combo2", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            #plots = results["responseData"]["data"][0]["plots"]
            #if(len(plots) > 0):
                #if status.lower() == "live" or status.lower() == "published" or status.lower() == "publish":
                #    print("Live kelikatar")
                #    for plos in plots:
                 #       if plos["name"] == "Live":
                  #          plots.clear()
                  #          plots.append(plos)
                #elif status.lower() == "draft" or status.lower() == "inprogress":
                #    print("draft")
                #    for plos in plots:
                #        if plos["name"] == "Draft":
                #            plots.clear()
                #            plots.append(plos)
                #elif status.lower() == "review" or status.lower() == "reviewed":
                #    print("review")
                #    for plos in plots:
                #        if plos["name"] == "Review":
                #            plots.clear()
                #            plots.append(plos)
            print(results["responseData"]["data"][0]["plots"])
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "courses_live_or_draft_or_review", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "courses_live_or_draft_or_review", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "courses_live_or_draft_or_review", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements




def get_courses_started(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"ceodashboards","visualizationType":"CHART","visualizationCode":"ceo13", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "courses_started", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "courses_started", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "courses_started", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements
    
def get_users_onboarded(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART","visualizationCode":"combo8", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "users_onboarded", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "users_onboarded", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "users_onboarded", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements
    
    
def get_number_of_courses_added(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART","visualizationCode":"combo9", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "number_of_courses_added", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "number_of_courses_added", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "number_of_courses_added", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements

    
    
def get_top_10_courses_by_ratings(text, entities, session_id):
    date = "last 6 months"
    factor = ''
    size = ''
    startDate = ''
    endDate = ''
    dashboard = ''
    code = ''
    vtype = ''
    details = {}
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
            if ent['entity'] == 'factor':
                factor = ent['value']
            if ent['entity'] == 'number':
                size = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    duckObj1 = duck.parse(size)
    if len(duckObj1) > 0:
        print(duckObj1)
    for dobject in duckObj1:
        if dobject["dim"] == 'number':
            #print(dobject["body"])
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    print(size)
    if 'ratings' in text or 'rating' in text:
        details = r.get("top10coursesByrating")
        details = json.loads(details)
        print(type(details))
        #dashboard = 'spvdashboard'
        #code = 'vspvcp1'
        #vtype = 'CHART'
    else:
        details = r.get("top10coursesBycompletion")
        details = json.loads(details)
        print(type(details))
        #dashboard = 'spvdashboard'
        #code = 'vspv991'
        #vtype = 'CHART'
    #headers={'Authorization': dev_apiKey}
    #payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":dashboard,"visualizationType":vtype,"visualizationCode":code, "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    #response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    #print(response.text)
    #results = json.loads(response.text)
    #print(results)
    #if(results["statusInfo"]["statusCode"] == 200):
        #if(len(results["responseData"]) > 0):
            #details = results["responseData"]
    print(details)
    plots = details["data"][0]["plots"]
    if(len(plots) > 0):
        if(size!= '' and len(plots) > size):
            new_list = plots[:size]
            plots = new_list
            print(plots)
            details["data"][0]["plots"] = plots
            details["data"][0]["headerName"] = details["data"][0]["headerName"].replace("10", str(size))
        elements = [{"type":"visualisations","entities":entities, "intent" : "top_10_courses_by_completions", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "top_10_courses_by_completions", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    #else:
    #    elements = [{"type":"direct","entities":entities, "intent" : "top_10_courses_by_completions", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements


def get_courses_by_provider(text, provider, session_id):
    headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
    payload = {"request": {"filters": {"contentType": ["Course"], "primaryCategory": [], "mimeType": [], "source": [provider], "mediaType": [], "status": ["Live"]}, "query": "",  "sort_by": {"lastUpdatedOn": ""}, "fields": [], "facets": ["contentType", "mimeType", "source"]}}
    response = requests.post('https://'+host+'/api/composite/v1/search', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    if(results["responseCode"] == "OK"):
        if(results["result"]["count"] > 0):
            details = results["result"]["content"]
            elements = [{"type":"course", "intent" : "courses_by_provider", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct", "intent" : "courses_by_provider", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": results["responseCode"]}]
    else:
        elements = [{"type":"direct", "intent" : "courses_by_provider", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    return elements
    


def get_cbp_provider_leaderboard(text, entities, session_id):
    size = ''
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
            if ent['entity'] == 'size':
                size = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    duckObj1 = duck.parse(size)
    if len(duckObj1) > 0:
        print(duckObj1)
    for dobject in duckObj1:
        if dobject["dim"] == 'number':
            #print(dobject["body"])
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    details = r.get("cbpProviderleaderBoard")
    details = json.loads(details)
    print(type(details))
    print(details)
    plots = details["data"][0]["plots"]
    if(len(plots) > 0):
        if(size!= '' and len(plots) > size):
            new_list = plots[:size]
            plots = new_list
            print(plots)
            details["data"][0]["plots"] = plots
            details["data"][0]["headerName"] = details["data"][0]["headerName"].replace("10", str(size))
        elements = [{"type":"visualisations", "intent" : "cbp_provider_leaderboard", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct", "intent" : "cbp_provider_leaderboard", "text" : "Seems like there is nothing matching to your query.", "statusCode": 200}]
    #headers1={'Authorization': dev_apiKey}
    #payload1 = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"ceodashboards","visualizationType":"METRIC","visualizationCode":"vcbp999", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    #response1 = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers1, json = payload1)
    #results1 = json.loads(response1.text)
    #if(results1["statusInfo"]["statusCode"] == 200):
        #if(len(results1["responseData"]) > 0):
            #details1 = results1["responseData"]
            #plots = details1["data"][0]["plots"]
            #if(len(plots) > 0):
                #if(size!= '' and len(plots) > size):
                    #new_list = plots[:size]
                    #plots = new_list
                    #print(plots)
                    #details1["data"][0]["plots"] = plots
            #print(combined_data)
    #else:
        #elements = [{"type":"direct", "intent" : "cbp_provider_leaderboard", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results1["responseCode"]}]
    return elements

    
def get_top_10_mdos_by_course_completions(text, entities, session_id):
    date = "last 6 months"
    factor = ''
    size = ''
    startDate = ''
    endDate = ''
    dashboard = ''
    code = ''
    vtype = ''
    details = {}
    print(entities)
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
            if ent['entity'] == 'factor':
                factor = ent['value']
            if ent['entity'] == 'number':
                size = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    duckObj1 = duck.parse(size)
    if len(duckObj1) > 0:
        print(duckObj1)
    for dobject in duckObj1:
        if dobject["dim"] == 'number':
            #print(dobject["body"])
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    print(size)
    print(factor)
    if factor == 'users onboard' or "onboard" in text.lower() or "onboarded" in text.lower() or "on boarded" in text.lower() or "on board" in text.lower():
        details = r.get("top10mdosByusersOnboard")
        details = json.loads(details)
        print(type(details))
        #dashboard = 'overview'
        #code = 'voverviewpe21'
        #vtype = 'CHART'
    elif factor == 'live courses' or 'live' in text or 'live course' in text or 'published' in text or 'publish' in text:
        details = r.get("top10mdosByliveCourses")
        details = json.loads(details)
        print(type(details))
        #dashboard = 'overview'
        #code = 'voverviewcp63'
        #vtype = 'CHART'
    else:
        details = r.get("top10mdosBycompletion")
        details = json.loads(details)
        print(type(details))
        #dashboard = 'overview'
        #dashboard = 'spvdashboard'
        #code = 'vspv992'
        #vtype = 'CHART'       
    #headers={'Authorization': dev_apiKey}
    #payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":dashboard,"visualizationType":vtype, "visualizationCode":code, "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    #response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    #print(response.text)
    #results = json.loads(response.text)
    #print(results)
    #if(results["statusInfo"]["statusCode"] == 200):
        #if(len(results["responseData"]) > 0):
        #details = results["responseData"]
    plots = details["data"][0]["plots"]
    if(len(plots) > 0):
        if(size!= '' and len(plots) > size):
            new_list = plots[:size]
            plots = new_list
            print(plots)
            details["data"][0]["plots"] = plots
            details["data"][0]["headerName"] = details["data"][0]["headerName"].replace("10", str(size))
        elements = [{"type":"visualisations","entities":entities, "intent" : "top_10_mdos_by_users_onboarded", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "top_10_mdos_by_users_onboarded", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    return elements
    
    


def get_user_engagement_by_factor(text, entities, session_id):
    date = "last 6 months"
    factor = ''
    size = ''
    startDate = ''
    endDate = ''
    print(entities)
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
            if ent['entity'] == 'factor':
                factor = ent['value']
            if ent['entity'] == 'number':
                size = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    duckObj1 = duck.parse(size)
    if len(duckObj1) > 0:
        print(duckObj1)
    for dobject in duckObj1:
        if dobject["dim"] == 'number':
            #print(dobject["body"])
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    print(size)
    print(factor)
    details = r.get("userEngagementbyHubs")
    details = json.loads(details)
    print(type(details))
    #headers={'Authorization': dev_apiKey}
    #payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"spvdashboard","visualizationType":"METRIC", "visualizationCode":"vspv307", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    #response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    #print(response.text)
    #results = json.loads(response.text)
    #print(results)
    #if(results["statusInfo"]["statusCode"] == 200):
        #if(len(results["responseData"]) > 0):
            #details = results["responseData"]
    plots = details["data"][0]["plots"]
    if(len(plots) > 0):
        if(size!= '' and len(plots) > size):
            new_list = plots[:size]
            plots = new_list
            print(plots)
            details["data"][0]["plots"] = plots
        elements = [{"type":"visualisations","entities":entities, "intent" : "user_engagement_by_factor", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "user_engagement_by_factor", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    return elements
    


def get_mdo_top_performers(text, entities, session_id, wid, mdo_id):
    print("inside mdo top performers")
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    size = ''
    details = {}
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'number':
                size = ent['value']
    duckObj = duck.parse(size)
    if len(duckObj) > 0:
        print(duckObj)
    for dobject in duckObj:
        if dobject["dim"] == 'number':
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    print(size)
    headers={"X-Channel-Id":mdo_id, "Authorization": dev_apiKey, "x-authenticated-user-token": session_id}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"mdodashboard","visualizationType":"CHART", "visualizationCode":"vmdo991", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            plots = details["data"][0]["plots"]
            if(len(plots) > 0):
                if(size!= '' and len(plots) > size):
                    new_list = plots[:size]
                    plots = new_list
                    print(plots)
                    details["data"][0]["plots"] = plots
            elements = [{"type":"visualisations","entities":entities, "intent" : "mdo_top_performers", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "mdo_top_performers", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "mdo_top_performers", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": 200}]
    return elements
    

def get_mdo_top_courses(text, entities, session_id, wid, mdo_id):
    print("inside mdo top performers")
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    size = ''
    details = {}
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'number':
                size = ent['value']
    duckObj = duck.parse(size)
    if len(duckObj) > 0:
        print(duckObj)
    for dobject in duckObj:
        if dobject["dim"] == 'number':
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    print(size)
    headers={"X-Channel-Id":mdo_id, "Authorization": dev_apiKey, "x-authenticated-user-token": session_id}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"mdodashboard","visualizationType":"CHART", "visualizationCode":"vmdo992", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            plots = details["data"][0]["plots"]
            if(len(plots) > 0):
                if(size!= '' and len(plots) > size):
                    new_list = plots[:size]
                    plots = new_list
                    print(plots)
                    details["data"][0]["plots"] = plots
            elements = [{"type":"visualisations","entities":entities, "intent" : "mdo_top_courses", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "mdo_top_courses", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "mdo_top_courses", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": 200}]
    return elements
    

def get_mdo_roles(text, entities, session_id, wid, mdo_id):
    print("inside mdo top performers")
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    size = ''
    details = {}
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'number':
                size = ent['value']
    duckObj = duck.parse(size)
    if len(duckObj) > 0:
        print(duckObj)
    for dobject in duckObj:
        if dobject["dim"] == 'number':
            val = dobject["body"]
            size = int(dobject["value"]["value"])
    print(size)
    headers={"X-Channel-Id":mdo_id, "Authorization": dev_apiKey, "x-authenticated-user-token": session_id}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"mdodashboard","visualizationType":"CHART", "visualizationCode":"vmdo993", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            plots = details["data"][0]["plots"]
            if(len(plots) > 0):
                if(size!= '' and len(plots) > size):
                    new_list = plots[:size]
                    plots = new_list
                    print(plots)
                    details["data"][0]["plots"] = plots
            elements = [{"type":"visualisations","entities":entities, "intent" : "mdo_roles", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "mdo_roles", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "mdo_roles", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": 200}]
    return elements
    
    
    

def get_top_10_courses_by_completions(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"spvdashboard","visualizationType":"CHART","visualizationCode":"vspv991", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "top_10_courses_by_completions", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "top_10_courses_by_completions", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "top_10_courses_by_completions", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements

def get_top_10_mdos_by_live_courses(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART","visualizationCode":"voverviewcp63", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "top_10_mdos_by_live_courses", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "top_10_mdos_by_live_courses", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "top_10_mdos_by_live_courses", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements
    
    
    

def get_top_10_mdos_by_users_onboarded(text, entities, session_id):
    date = "last 6 months"
    startDate = ''
    endDate = ''
    if(len(entities) > 0):
        for ent in entities:
            if ent['entity'] == 'date':
                date = ent['value']
    dates = getDates(date)
    startDate = dates["startDate"]
    endDate = dates["endDate"]
    print(startDate)
    print(endDate)
    headers={'Authorization': dev_apiKey}
    payload = {"RequestInfo":{"authToken":"null"},"headers":{"tenantId":"null"},"aggregationRequestDto":{"dashboardId":"overview","visualizationType":"CHART", "visualizationCode":"voverviewpe21", "queryType":"","filters":{},"moduleLevel":"","aggregationFactors":None,"requestDate":{"startDate":startDate,"endDate":endDate}}}
    response = requests.post('https://'+spv_dev_host+'/api/dashboard/analytics/getChartV2/Karmayogi', headers=headers, json = payload)
    print(response.text)
    results = json.loads(response.text)
    print(results)
    if(results["statusInfo"]["statusCode"] == 200):
        if(len(results["responseData"]) > 0):
            details = results["responseData"]
            elements = [{"type":"visualisations","entities":entities, "intent" : "top_10_mdos_by_users_onboarded", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": 200}]
        else:
            elements = [{"type":"direct","entities":entities, "intent" : "top_10_mdos_by_users_onboarded", "text" : "Seems like we don't have what you are looking for at the moment.", "statusCode": 200}]
    else:
        elements = [{"type":"direct","entities":entities, "intent" : "top_10_mdos_by_users_onboarded", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["statusInfo"]["statusCode"]}]
    return elements

    
    
def my_connections(text, wid, session_id):
# find the wids of your connections
    wids = getConnections(wid, session_id)
    print(wids)
    if len(wids) > 0:
        headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
        payload = {"request": {"filters": { "userId": wids}}}
        response = requests.post('https://'+host+'/api/user/v1/search', headers=headers, json = payload)
        results = json.loads(response.text)
        print(results)
        if(results["responseCode"]== "OK"):
            if(len(results["result"]["response"]["content"]) > 0):
                details = results["result"]["response"]["content"]
                elements = [{"type":"contact", "intent" : "my_connections", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
            else:
                elements = [{"type":"direct", "intent" : "my_connections", "text" : "Seems like you dont have any connections.", "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct", "intent" : "my_connections", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    else:
        elements=[{"type":"direct", "intent" : "my_connections", "text" : "Seems like you dont have any connections.", "statusCode": 200}]     
    return elements


def getConnections(wid, session_id):
    headers = {'rootOrg' : "igot", 'org': "dopt", 'Authorization': apiKey, 'userId' : wid, "x-authenticated-user-token": session_id}
    response = requests.get('https://'+host+'/api/connections/profile/fetch/established', headers=headers)
    results = json.loads(response.text)
    #print(results)
    wids = []
    if(results["result"]["status"]== "OK"):
        if(len(results["result"]["data"]) > 0):
            details = results["result"]["data"]
            for connections in details:
                print(connections)
                wids.append(connections['id'])
    return wids
    


def get_connection_requests_recieved(text, wid, session_id):
# find the wids of your connections
    wids = getConnectionsRequests(wid, session_id)
    print(wids)
    if len(wids) > 0:
        headers={'Authorization':apiKey, 'x-authenticated-user-token':session_id}
        payload = {"request": {"filters": { "userId": wids}}}
        response = requests.post('https://'+host+'/api/user/v1/search', headers=headers, json = payload)
        results = json.loads(response.text)
        print(results)
        if(results["responseCode"]== "OK"):
            if(len(results["result"]["response"]["content"]) > 0):
                details = results["result"]["response"]["content"]
                elements = [{"type":"contact", "intent" : "connection_requests_recieved", "text" : "Here's what you were looking for!<br>", "data": details, "statusCode": results["responseCode"]}]
            else:
                elements = [{"type":"direct", "intent" : "connection_requests_recieved", "text" : "Seems like you dont have any connection requests.", "statusCode": results["responseCode"]}]
        else:
            elements = [{"type":"direct", "intent" : "connection_requests_recieved", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": results["responseCode"]}]
    else:
        elements=[{"type":"direct", "intent" : "connection_requests_recieved", "text" : "Seems like you dont have any connection requests.", "statusCode": 200}]     
    return elements


def getConnectionsRequests(wid, session_id):
    headers = {'rootOrg' : "igot", 'org': "dopt", 'Authorization': apiKey, 'userId' : wid, "x-authenticated-user-token": session_id}
    response = requests.get('https://'+host+'/api/connections/profile/fetch/requests/received', headers=headers)
    results = json.loads(response.text)
    #print(results)
    wids = []
    if(results["result"]["status"]== "OK"):
        if(len(results["result"]["data"]) > 0):
            details = results["result"]["data"]
            for connections in details:
                print(connections)
                wids.append(connections['id'])
    return wids

    

################################################### migrated apis END #############################################################
    
def fetch_head_count(session_id, user_id, entities):
    user_id = user_id.rstrip(user_id[-1])
    res = requests.post('https://kronos.tarento.com/api/v1/user/getAllUsersCompleteData', headers={'Content-type': 'application/json', 'Authorization':session_id}, json = {})
    result = res.json()
    countryWise = {}
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
            for emps in details:
                if(emps["isactive"] == True):
                    country = emps["country"]
                    if(country in countryWise):
                        unitWise = countryWise[country]
                        if(emps["country"] == country and (emps["buName"] not in unitWise)):
                            count = {}
                            female =0
                            male = 0
                            if emps["gender"] == "M":
                                male = male + 1
                            else:
                                female = female + 1
                            count["female"] = female
                            count["male"] = male
                            unitWise[emps["buName"]] = count
                        else:
                            count = unitWise[emps["buName"]];
                            female = count["female"]
                            male = count["male"]
                            if emps["gender"] == "M":
                                male = male + 1
                            else:
                                female = female + 1
                            count["female"] = female
                            count["male"] = male
                            unitWise[emps["buName"]] = count
                        countryWise[country] = unitWise
                    else:
                        unitWise = {}
                        if(emps["country"] == country and (emps["buName"] not in unitWise)):
                            count = {}
                            female =0
                            male = 0
                            if emps["gender"] == "M":
                                male = male + 1
                            else:
                                female = female + 1
                            count["female"] = female
                            count["male"] = male
                            unitWise[emps["buName"]] = count
                        else:
                            count = unitWise[emps["buName"]];
                            female = count["female"]
                            male = count["male"]
                            if emps["gender"] == "M":
                                male = male + 1
                            else:
                                female = female + 1
                            count["female"] = female
                            count["male"] = male
                            unitWise[emps["buName"]] = count
                        countryWise[country] = unitWise
            print(countryWise)
            elements = [{"type":"count", "intent" : "head_count", "text" : "Here's what i found", "data": countryWise, "statusCode": result['statusCode']}]
        else:
            elements = [{"type":"direct", "intent" : "experience_ratio", "text" : "No data found", "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"direct", "intent" : "head_count", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements

def fetch_experience_ratio(session_id, user_id, entities):
    user_id = user_id.rstrip(user_id[-1])
    res = requests.post('https://kronos.tarento.com/api/v1/user/getAllUsersCompleteData', headers={'Content-type': 'application/json', 'Authorization':session_id}, json = {})
    result = res.json()
    exp_in_yrs = {}
    now = datetime.now().strftime("%Y-%m-%d")
    d2 = datetime.strptime(now, "%Y-%m-%d")
    print(d2)
    maleCount = 0
    femaleCount = 0
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
            for emps in details:
                if(emps["isactive"] == True):
                    if(emps["gender"] == "M"):
                        maleCount = maleCount + 1;
                    else:
                        femaleCount = femaleCount + 1;
                    if(emps["dofj"] != None):
                        dofj = emps["dofj"]
                        d1 = datetime.strptime(dofj, "%Y-%m-%d")
                        exp = int(str((d2 - d1).days))
                        if(exp > 0):
                            years = round(exp/365)
                            if(years not in exp_in_yrs):
                                value = 1;
                                exp_in_yrs[years] = value
                            else:
                                value = exp_in_yrs[years]
                                value = value + 1
                                exp_in_yrs[years] = value
            exp_in_yrs = dict(collections.OrderedDict(sorted(exp_in_yrs.items())))
            exp_in_yrs["male"] = maleCount
            exp_in_yrs["female"] = femaleCount
            print(exp_in_yrs)
            elements = [{"type":"experience", "intent" : "experience_ratio", "text" : "Here's what i found", "data": exp_in_yrs, "statusCode": result['statusCode']}]
        else:
            elements = [{"type":"direct", "intent" : "experience_ratio", "text" : "No data found", "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"direct", "intent" : "experience_ratio", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements
    
    


def fetch_new_joinees(session_id, user_id, entities):
    user_id = user_id.rstrip(user_id[-1])
    res = requests.post('https://kronos.tarento.com/api/v1/user/getAllUsersCompleteData', headers={'Content-type': 'application/json', 'Authorization':session_id}, json = {})
    result = res.json()
    new_joinees = {}
    now = datetime.now().strftime("%Y-%m-%d")
    d2 = datetime.strptime(now, "%Y-%m-%d")
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
            for emps in details:
                if(emps["isactive"] == True):
                    if(emps["doj"] != None):
                        doj = emps["doj"]
                        d1 = datetime.strptime(doj, "%Y-%m-%d")
                        exp = int(str((d2 - d1).days))
                        if(exp < 31):
                            if(emps["buName"].lower() not in new_joinees):
                                joinees = 1;
                            #etypes = []
                            #etypes.append(events)                           
                                new_joinees[emps["buName"].lower()] = joinees
                            else:
                                joinees = new_joinees[emps["buName"].lower()]
                                joinees = joinees + 1;
                                new_joinees[emps["buName"].lower()] = joinees
            print(len(new_joinees))
            elements = [{"type":"joinees", "intent" : "new_joinees", "text" : "Here's what i found", "data": new_joinees, "statusCode": result['statusCode']}]
        else:
            elements = [{"type":"direct", "intent" : "new_joinees", "text" : "No data found", "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"direct", "intent" : "new_joinees", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements
    
    
def fetch_exits(session_id, user_id, entities):
    user_id = user_id.rstrip(user_id[-1])
    res = requests.post('https://kronos.tarento.com/api/v1/user/getAllUsersCompleteData', headers={'Content-type': 'application/json', 'Authorization':session_id}, json = {})
    result = res.json()
    exits = {}
    now = datetime.now().strftime("%Y-%m-%d")
    d2 = datetime.strptime(now, "%Y-%m-%d")
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
            for emps in details:
                if(emps["dol"] != None):
                    dol = emps["dol"]
                    d1 = datetime.strptime(dol, "%Y-%m-%d")
                    exp = int(str((d2 - d1).days))
                    if(exp < 31):
                        if(emps["buName"].lower() not in exits):
                            left = 1;
                            #etypes = []
                            #etypes.append(events)                           
                            exits[emps["buName"].lower()] = left
                        else:
                            left = exits[emps["buName"].lower()]
                            left = left + 1;
                            exits[emps["buName"].lower()] = left
            print(len(exits))
            elements = [{"type":"joinees", "intent" : "exits", "text" : "Here's what i found", "data": exits, "statusCode": result['statusCode']}]
        else:
            elements = [{"type":"direct", "intent" : "exits", "text" : "No data found", "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"direct", "intent" : "exits", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements



def policy_search(text, entities):
    if(len(entities) > 0 and entities[0]['entity'] == 'policy'):
        entity = entities[0]['value']
        print(entity)
    else:
        print("not identified")
        stopwords = ['get', 'fetch', 'policy', 'give', 'show', 'share', 'me', 'a', 'on', 'with', 'details', 'the', 'doc', 'document', 'docs', 'file', 'deck', 'ppt', 'presentation', 'files', 'provide', 'need', 'can', 'you']
        querywords = text.split()
        resultwords  = [word for word in querywords if word.lower() not in stopwords]
        entity = ' '.join(resultwords)
        print(entity)
    headers = {'Content-type': 'application/json'}
    query = json.dumps({"size":1,"query": {"multi_match" : {"query": entity, "fields": ["dataObject.Name", "dataObject.Tags.keyword"], "fuzziness": "AUTO"}}})
    print(query)
    response = requests.get('https://elastic:PuAz@itAqwsaR34bYu@elastic.pulz.app:443/fs-forms-data-thor/_search', headers=headers, data=query)
    print(response)
    results = json.loads(response.text)
    print(results)
    if(len(results["hits"]["hits"]) > 0 and results["hits"]["max_score"] > 2.0) :
        link = results["hits"]["hits"][0]["_source"]["dataObject"]["Link"]
        name = results["hits"]["hits"][0]["_source"]["dataObject"]["Name"]
        doctype = link.split(".com/")[1]
        doctype = doctype.split("/d")[0]
        if(doctype == 'file'):
            ftype = "document"
        elif(doctype == 'spreadsheets'):
            ftype = 'excel'
        else:
            ftype = 'presentation'
        #ftype = "presentation"
        data = {}
        data["link"] = "<a href =" + link + "target='_blank'>" + link + "</a>" 
        data["type"] = ftype
        data["name"] = name
        print(data)
        elements = [{"type":"direct","entities":entities, "intent" : "policy_search", "text" : "Here's what i found" , "data": data}]
    else:
        res = requests.post('http://40.113.200.227:4005/getFileIndex')
        print(res)
        result = json.loads(res.text)
        elements = [{"type":"direct","entities":entities, "intent" : "policy_search", "text" : "Seems like we don't have what you are looking for at the moment. Please have a look at the files that are available", "data":result['payload']}]
    return elements
    

def fetch_sales_collateral(text, entities):
    sales_1={}
    sales_1["link"] = "<a href = https://docs.google.com/presentation/d/1zUObSuRqFGSKM7ssupOcA2gswSGn2ripDeKeR0sefaI/edit?usp=sharing target='_blank'> https://docs.google.com/presentation/d/1zUObSuRqFGSKM7ssupOcA2gswSGn2ripDeKeR0sefaI/edit?usp=sharing</a>" 
    sales_1["type"] = "presentation"
    sales_1["name"] = "Company portfolio"
    elements = [{"type":"direct","entities":entities, "intent" : "policy_search", "text" : "Here's what you were looking for!<br>", "data": sales_1}]
    return elements
    




def report_time(session_id):
    res = requests.post('https://kronos.tarento.com/api/v1/user/getAllProjectTask', headers={'Authorization':session_id})
    result = res.json()
    projectTaskList = []
    details = {}
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
        for project_details in details["projectList"]:
            key = project_details["name"]
            p_id = project_details["id"]
            for task_details in details["projectTaskMap"]:
                projectTasks = {}
                if(p_id == task_details["projectId"]):
                    taskList = task_details["taskList"]
                    for i in range(len(taskList)):
                        for task_details in details["taskList"]:
                            if taskList[i] == task_details["id"]:
                                taskList[i] = task_details["name"]
            projectTasks[key] = taskList
            projectTaskList.append(projectTasks)
        print(projectTaskList)
        elements = [{"type":"direct", "intent" : "report_time", "text" : "Hi, reporting my time here", "data":projectTaskList, "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"direct", "intent" : "report_time", "text" : "Please try after sometime", "statusCode": result['statusCode']}]
    return elements


def fetch_project_reports(text, session_id, reports):
    headers = {'Content-type': 'application/json', 'Authorization': session_id}
    p_details = get_project_id(session_id, reports)
    print(p_details)
    if(len(p_details) == 0):
        elements = [{"type":"direct","entities":entities, "intent" : "project_report", "text" : "Seems like we don't have report for" + report+".", "statusCode": 200}]
    else:
        users_list = []
        for k, v in p_details.items():
            response = requests.post('https://kronos.tarento.com/api/v1/user/getCustomizedReport', headers=headers, json = {"endDate": "2022-10-30", "filters": [{"id": v, "name": 'project'}], "reportType": ["user_project_task"], "startDate": "2022-10-01"})
            r = response.json()
            if r['statusCode'] == 200:
                results = json.loads(response.text)
                details = results['responseData']['summaryReport']['user_project_task']
                empList = {}
                user_details = []
                users = {}
                totalHours = 0
                for emps in details:
                    if(emps['firstName'] + ' ' + emps['lastName'] in empList.keys()):
                        empList[emps['firstName'] + ' ' + emps['lastName']]['tasks'][emps['taskName']] = round(((emps['time'])/60), 1)
                        empList[emps['firstName'] + ' ' + emps['lastName']]['totalTime'] = round(empList.get(emps['firstName'] + ' ' + emps['lastName']).get('totalTime') + ((emps['time'])/60), 1)
                        totalHours = totalHours + ((emps['time'])/60)
                    else:
                        tasks = {}
                        empDetails = {}
                        indTime = 0
                        tasks[emps['taskName']] = round(((emps['time'])/60), 1)
                        empDetails['tasks'] = tasks
                        indTime = round(indTime + ((emps['time'])/60), 1)
                        empDetails['totalTime'] = round(indTime, 1)
                    #empDetails[]
                    #empDetails['totalTime'] = 
                        empList[emps['firstName'] + ' ' + emps['lastName']] = empDetails
                        totalHours = round(totalHours + ((emps['time'])/60), 1)
                sortedList = collections.OrderedDict(sorted(empList.items(), key=lambda t:t[1]["totalTime"], reverse=True))
                print(sortedList)
                user_details.append(dict(sortedList))
                if(len(sortedList) < 1):
                    elements = [{"type":"direct", "intent" : "project_report", "text" : "Seems like there hasn't been any activity on "+k+" this month", "statusCode": r['statusCode']}]
                    users['totalHours'] = round(totalHours, 1)
                    users['fullName'] = k
                else:
                    users['user_details'] = user_details
                    users['totalHours'] = round(totalHours, 1)
                    users['fullName'] = k
                users_list.append(users)    
            print(users_list)
    elements = [{"type":"reports", "intent" : "project_report", "text" : "hello", "data": users_list, "statusCode": r['statusCode']}]
    return elements




def fetch_user_reports(text, session_id, report):
    print(report)
    headers = {'Content-type': 'application/json', 'Authorization': session_id}
    u_id = get_user_id(session_id, report)
    print(u_id)
    if(len(u_id) == 0):
        elements = [{"type":"direct","entities":entities, "intent" : "project_report", "text" : "Seems like we don't have report for" + report+".", "statusCode": 200}]
    else:
        users_list = []
        for k, v in u_id.items():
            print(k)
            response = requests.post('https://kronos.tarento.com/api/v1/user/getCustomizedReport', headers=headers, json = {"endDate": "2022-10-30", "filters": [{"id": v, "name": 'user'}], "reportType": ["user_project_task"], "startDate": "2022-10-01"})
            r = response.json()
            if r['statusCode'] == 200:
                results = json.loads(response.text)
                print(results)
                details = results['responseData']['summaryReport']['user_project_task']
                empList = {}
                user_details = []
                users = {}
                totalHours = 0
                for emps in details:
                    if(emps['projectName'] in empList.keys()):
                        empList[emps['projectName']]['tasks'][emps['taskName']] = round(((emps['time'])/60), 1)
                        empList[emps['projectName']]['totalTime'] = round(empList.get(emps['projectName']).get('totalTime') + ((emps['time'])/60), 1)
                        totalHours = totalHours + ((emps['time'])/60)
                    else:
                        tasks = {}
                        empDetails = {}
                        indTime = 0
                        tasks[emps['taskName']] =  round(((emps['time'])/60), 1)
                        empDetails['tasks'] = tasks
                        indTime = indTime + ((emps['time'])/60)
                        empDetails['totalTime'] = round(indTime, 1)
                    #empDetails[]
                    #empDetails['totalTime'] = 
                        empList[emps['projectName']] = empDetails
                        totalHours = totalHours + ((emps['time'])/60)
                sortedList = collections.OrderedDict(sorted(empList.items(), key=lambda t:t[1]["totalTime"], reverse=True))
                user_details.append(dict(sortedList))
                if(len(sortedList) < 1):
                    elements = [{"type":"direct", "intent" : "project_report", "text" : "Seems like "+report+" hasn't logged any hours this month.", "statusCode": r['statusCode']}]
                    users['totalHours'] = round(totalHours, 1)
                    users['fullName'] = k
                else:
                    users['user_details'] = user_details
                    users['totalHours'] = round(totalHours, 1)
                    users['fullName'] = k
            #users_list[""]
            #empList['totalHours'] = totalHours
                users_list.append(users)
            print(users_list)
    elements = [{"type":"reports", "intent" : "user_report", "text" : "hello", "data": users_list, "statusCode": r['statusCode']}]
    return elements

def get_user_id(session_id, reports):
    print(reports)
    u_id = {}
    headers = {'Content-type': 'application/json', 'Authorization': session_id}
    response = requests.post('https://kronos.tarento.com/api/v1/user/getAllUsersByOrg', headers=headers, json = {})
    result = response.json()
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
        for name in reports:
            for users in details:
                if(len(name.split()) > 1):
                    firstname = name.split(" ")[0].lower()
                    lastname = name.split(" ")[1].lower()
                    if((firstname == users["firstName"].lower() or firstname in users["firstName"].lower()) and (lastname == users["lastName"].lower() or lastname in users["lastName"].lower())):
                        u_id[users["firstName"] + " " + users["lastName"]] = users["userId"]
                else:
                    firstname = name.lower()
                    if(firstname == users["firstName"].lower() or firstname in users["firstName"].lower()):
                        u_id[users["firstName"] + " " + users["lastName"]] = users["userId"]
    else:
        print("invalid jwt.Please login")
    print(u_id)
    return u_id


def get_project_id(session_id, reports):
    headers = {'Content-type': 'application/json', 'Authorization': session_id}
    response = requests.post('https://kronos.tarento.com/api/v1/user/getAllProject', headers=headers, json = {})
    result = response.json()
    p_details = {}
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            print('inside if')
            details = result['responseData']
        for project in reports:
            for projects in details:
                if((project.lower() in projects["name"].lower()) or (project.lower() == projects["name"].lower())):
                    print(projects["name"])
                    p_details[projects["name"]] = projects["id"]
    else:
        print("invalid jwt.Please login")
    print(p_details)
    return p_details


def getDefaulterList(session_id, entities):
    entity = ''
    if(len(entities) > 0):
        entity = entities[0]['value']
        print(entity)
    else:
        print("not identified")
        entity = ''
    if(entity!= ''):
        duckObj = duck.parse(entity)
    else:
        duckObj = duck.parse("today")
    grain = duckObj[0]["value"]["grain"]
    
    date =  (duckObj[0]["value"]["value"]).split("T")[0]
    print(date)
    print(session_id)
    today = datetime.today().strftime('%Y-%m-%d')
    yesterday = datetime.now() - timedelta(1)
    tomorrow = datetime.strptime(today, "%Y-%m-%d") + timedelta(days = 1)
    startDate = ''
    endDate = ''
    if(grain == 'day'):
        startDate = datetime.strptime(date, "%Y-%m-%d")
        endDate = datetime.strptime(date, "%Y-%m-%d")
    elif(grain == 'week' and "last" in entity.lower()):
        startDate = datetime.strptime(date, "%Y-%m-%d")
        endDate = startDate + timedelta(days=6)
    elif(grain == 'week' and 'this' in entity.lower()):
        startDate = datetime.strptime(date, "%Y-%m-%d")
        endDate = datetime.today().strftime('%Y-%m-%d')
    elif(grain == 'month' and 'this' in entity.lower()):
        startDate = datetime.strptime(date, "%Y-%m-%d")
        endDate = datetime.today().strftime('%Y-%m-%d')
    elif(grain == 'month' and 'last' in entity.lower()):
        startDate = datetime.strptime(date, "%Y-%m-%d")
        endDate = startDate + timedelta(days=30)
    else:
        startDate = today
        endDate = today
    startDate = str(startDate).split(" ")[0]
    endDate = str(endDate).split(" ")[0]
    print(startDate)
    print(endDate)
    decoded = jwt.decode(session_id.split("jwt/")[1], options={"verify_signature": False}) # works in PyJWT >= v2.0
    print (decoded)
    u_id = (decoded["USER-ID"])
    bu_id = 0
    headers = {'Content-type': 'application/json', 'Authorization': session_id.split("jwt/")[1]}
    response = requests.post('https://kronos.tarento.com/api/v1/user/getAllUsersByOrg', headers=headers, json = {})
    result = response.json()
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            print('inside if')
            details = result['responseData']
            for users in details:
                if(users["userId"] == u_id):
                    bu_id = users["buId"]
    print(bu_id)
    headers = {'Content-type': 'application/json', 'Authorization': session_id.split("jwt/")[1]}
    response = requests.post('https://kronos.tarento.com/api/v1/user/defaultersReport', headers=headers, json = {"startDate": startDate, "endDate": endDate, "buId": bu_id})
    result = response.json()
    employeeList = []
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            employees = result['responseData']
            for emps in employees:
                employeeList.append(emps['name'])
            elements = [{"type":"direct", "entities":entities, "intent" : "defaulter_list", "text" : "The defaulters list for "+entity+" is as follows <br>"+ "<br>".join(employeeList)}]   
        else:
            employeeList = []
            elements = [{"type":"direct", "entities":entities, "intent" : "defaulter_list", "text" : "There are no defaulters"}]        
    elif result['statusCode'] == 444:
        elements = [{"type":"direct", "entities":entities, "intent" : "defaulter_list", "text" : "Seems like you are not authorized to access this information"}]
    else:
        elements = [{"type":"direct", "entities":entities, "intent" : "defaulter_list", "text" : "Oops! seems like we are having some trouble. Please try after sometime"}]
    return elements

def getUnBillableList(session_id, entities):
    
    headers = {'Content-type': 'application/json', 'Authorization': session_id}
    response = requests.post('https://kronos.tarento.com/api/v1/user/getAllProject', headers=headers, json = {})
    result = response.json()
    unbilled_projects = []
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            details = result['responseData']
            for projects in details:
                if projects["billable"] == False:
                    unbilled_projects.append(projects["name"])
        response = requests.post('https://kronos.tarento.com/api/v1/user/getCustomizedReport', headers=headers, json = {"endDate": "2022-06-30", "filters": [{"id": 51, "name": 'department'}], "reportType": ["user_project_task"], "startDate": "2022-06-01"})
        results = json.loads(response.text)
        details = results['responseData']['summaryReport']['user_project_task']
        empList = {}
        user_details = []
        users = {}
        totalHours = 0
        for emps in details:
            if(emps["projectName"] in unbilled_projects):
                if(emps['firstName'] + ' ' + emps['lastName'] in empList.keys()):
                    empList[emps['firstName'] + ' ' + emps['lastName']]['tasks'][emps['taskName']] = round(((emps['time'])/60), 1)
                    empList[emps['firstName'] + ' ' + emps['lastName']]['totalTime'] = round(empList.get(emps['firstName'] + ' ' + emps['lastName']).get('totalTime') + ((emps['time'])/60), 1)
                    totalHours = totalHours + ((emps['time'])/60)
                else:
                    tasks = {}
                    empDetails = {}
                    indTime = 0
                    tasks[emps['taskName']] = round(((emps['time'])/60), 1)
                    empDetails['tasks'] = tasks
                    indTime = round(indTime + ((emps['time'])/60), 1)
                    empDetails['totalTime'] = round(indTime, 1)
                    print(empDetails)
                    empList[emps['firstName'] + ' ' + emps['lastName']] = empDetails
                    totalHours = round(totalHours + ((emps['time'])/60), 1)
        sortedList = collections.OrderedDict(sorted(empList.items(), key=lambda t:t[1]["totalTime"], reverse=True))
        user_details.append(dict(sortedList))
        print(len(sortedList))
        if(len(sortedList) < 1):
            print("hello")
            elements = [{"type":"direct","entities":entities, "intent" : "unbillable_list", "text" : "no activity", "statusCode": result['statusCode']}]
        else:
            print("The total number of employees is " + str(len(user_details)))
            users['user_details'] = user_details
            print(users)
            users['totalHours'] = round(totalHours, 1)
            elements = [{"type":"reports","entities":entities, "intent" : "unbillable_list", "text" : "unbiilable list is hereee", "data": users, "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"direct", "intent" : "unbillable_list", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements



def getIbuSummaryReport(sender, entities):
    unitWiseSummaryReport = {}
    res = requests.post('https://kronos.tarento.com/api/v1/user/getAllDailyUnitSummaryReport', headers={'Content-type': 'application/json', "Authorization": sender}, json = {})
    result = res.json()
    reportedPeople = 0
    nonCompliance = 0
    billableTimeReported = 0
    onLeave = 0
    reportedLessThan8H = 0
    totalNumberOfEmployees = 0
    totalTimetoBeReported = 0
    totalBillableTimetoBeReported = 0
    reportedTime = 0
    if result['statusCode'] == 200:
        if(len(result['responseData']) > 0):
            unitWiseSummaryReport = result['responseData']
        unitReports = {}
        for details in unitWiseSummaryReport:
            unit_id = details
            unitKey = {}
            if "reportedPeople" not in unitWiseSummaryReport[details]:
                reportedPeople = 0
            else:
                reportedPeople = unitWiseSummaryReport[details]["reportedPeople"]
            if "nonCompliance" not in unitWiseSummaryReport[details]:
                nonCompliance = 0
            else:
                nonCompliance = unitWiseSummaryReport[details]["nonCompliance"]      
            if "workHour" not in unitWiseSummaryReport[details]:
                reportedTime = 0
            else:
                reportedTime = unitWiseSummaryReport[details]["workHour"]
            if "billableHour" not in unitWiseSummaryReport[details] or unitWiseSummaryReport[details]["billableHour"] == None:
                print("Billable hour is there")
                billableTimeReported = 0
            else:
                print("billable time is not there")
                billableTimeReported = unitWiseSummaryReport[details]["billableHour"]
            if "leaveCount" not in unitWiseSummaryReport[details]:
                onLeave = 0
            else:
                onLeave = unitWiseSummaryReport[details]["leaveCount"]
            if "lessThan8H" not in unitWiseSummaryReport[details]:
                reportedLessThan8H = 0
            else:
                reportedLessThan8H = unitWiseSummaryReport[details]["lessThan8H"]
            totalNumberOfEmployees = reportedPeople + nonCompliance
            totalTimetoBeReported = 9 * totalNumberOfEmployees
            print(billableTimeReported)
            totalBillableTimetoBeReported = 8 * totalNumberOfEmployees
            notReported = nonCompliance
            unitKey["totalTimetoBeReported"] = totalTimetoBeReported;
            unitKey["reportedTime"] = "{:.2f}".format(reportedTime);
            unitKey["totalBillableTimetoBeReported"] = totalBillableTimetoBeReported;
            unitKey["billableTimeReported"] = "{:.2f}".format(billableTimeReported);
            unitKey["onLeave"] = onLeave;
            unitKey["reportedLessThan8H"] = reportedLessThan8H;
            unitKey["notReported"] = notReported;
            unitKey["reportedTimePercentage"] = "{:.2f}".format((reportedTime / totalTimetoBeReported) * 100)
            unitKey["billableTimeReportedPercentage"] = "{:.2f}".format((billableTimeReported / totalBillableTimetoBeReported) * 100)
            print("{:.2f}".format((reportedTime / totalTimetoBeReported) * 100))
            print("{:.2f}".format((billableTimeReported / totalBillableTimetoBeReported) * 100))
            unitReports[unit_id] = unitKey;
        for k in unitReports:
            print(k)
            if(k == '51'):
                print("NXT")
                repor = unitReports[k]
                elements = [{"type":"ibu_summary_report","entities":entities, "intent" : "ibu_summary_report", "text" : "Here's what you were looking for!<br>", "data": repor, "statusCode": result['statusCode']}]
    else:
        elements = [{"type":"ibu_summary_report","entities":entities, "intent" : "ibu_summary_report", "text" : "Seems like we don't have what you are looking for at the moment."}] 
    return elements
    
    
def viewUpcoming(text, session_id):
    headers = {'Content-type': 'application/json', 'Authorization': session_id}
    response = requests.post('https://kronos.idc.tarento.com/api/v1/user/getAllUpcomings', headers=headers, json = {"countryId":[1]})
    result = response.json()
    if result['statusCode'] == 200:
        print("inside this")
        if(len(result['responseData']) > 0):
            upcomings = {}
            details = result['responseData']
            for events in details:
                print(events)
                if(events["type"].lower() not in upcomings):
                    print("newww" + events["type"].lower())
                    etypes = []
                    etypes.append(events)                           
                    upcomings[events["type"].lower()] = etypes
                else:
                    etype = upcomings[events["type"].lower()]
                    print("old" + events["type"].lower())
                    etype.append(events)
                    upcomings[events["type"].lower()] = etype
            if ('training' in text.lower())or ('trainings' in text.lower()) or ("training's" in text.lower()):
                print("inside this")
                upcomings.pop('holiday')
            elif ('holiday' in text.lower()) or ('holidays' in text.lower()) or ("holiday's" in text.lower()):
                print("inside hilidays")
                upcomings.pop('training')
            else:
                upcomings = upcomings
            elements = [{"type":"upcoming", "intent" : "upcoming", "text" : "Here's the list of upcoming events", "data": upcomings, "statusCode": result['statusCode']}]
            print(upcomings)
        else:
             elements = [{"type":"upcoming", "intent" : "upcoming", "text" : "There are no upcoming events", "statusCode": result['statusCode']}]        
            
    else:
        print("I'm here")
        elements = [{"type":"upcoming", "intent" : "upcoming", "text" : "Oops! seems like we are having some trouble. Please try after sometime", "statusCode": result['statusCode']}]
    return elements

def send_email(entities, text, doc, recipient):
    print(doc)
    print(recipient)
    link =[]
    if(len(re.compile('\W').split(text)) > 3):
        if(len(re.compile('\W').split(recipient[0])) < 2 ):
            headers = {'Content-type': 'application/json'}
            query = json.dumps({"size":3,"query": {"fuzzy": {"firstname": {"value": recipient[0]}}}})
            response = requests.get('http://elastic:Elastic123@es.rain.idc.tarento.com:80/kronos-d2-users/_search', headers=headers, data=query)
            results = json.loads(response.text)
            pickle.dump(doc[0], open("variableStoringFile.dat", "wb"));
            print(results["hits"]["total"])
            if(results["hits"]["total"] > 1):
                print("Multiple people with same name")
                details = results["hits"]["hits"]
                elements = [{"type":"contact","entities":entities, "intent" : "send_email", "text" : "Can you confirm which one?", "data":details}]
            elif(results["hits"]["total"] == 1):
                print("only one. Send email directly")
                #result = send_email(doc, recipient)
                result = "done"
                elements = [{"type":"direct","entities":entities, "intent" : "send_email", "text" : result}]
            else:
                result = "Employee not found"
                elements = [{"type":"direct","entities":entities, "intent" : "send_email", "text" : result}]
        else:
            result = send_email(doc, recipient)
            elements = [{"type":"direct","entities":entities, "intent" : "send_email", "text" : result}]
    else:
        print("Given only name. So send email")
        #result = send_email(doc, recipient)
        result = "Sending email"
        variable = pickle.load(open("variableStoringFile.dat", "rb"))
        print(variable)
        elements = [{"type":"direct","entities":entities, "intent" : "send_email", "text" : result}]
    return elements
