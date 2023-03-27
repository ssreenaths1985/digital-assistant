# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.forms import FormAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import json
from api import *
import threading
from subprocess import call


provider_file = open("data/provider.txt", "r")
provider_content = provider_file.read()
provider_names = provider_content.split("\n")
provider_details = [x.lower() for x in provider_names]


def thread_second():
    call(["python", "scheduler.py"])
processThread = threading.Thread(target=thread_second)  # <- note extra ','
processThread.start()

print('the file is run in the background')



class FallbackAction(Action):
   def name(self):
      return "fallback_action"

   def run(self, dispatcher, tracker, domain):
      print('inside "fallback_action"')
      intent_ranking = tracker.latest_message.get('intent_ranking', [])
      print(intent_ranking)
      print(intent_ranking[0]['name'])
      if len(intent_ranking) > 0 :
         term = tracker.latest_message['text']
         word_list = term.split()
         number_of_words = len(word_list)
         if(number_of_words < 2):
            if tracker.latest_message['intent'].get('confidence') < 0.35 :
               dispatcher.utter_message(template='utter_out_of_scope')
         elif intent_ranking[0].get('name') == 'learning_course':
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             wid = json_object["wid"]
             stopwords = ['get', 'fetch', 'give', 'show', 'learners', 'people', 'list', 'of', 'persons', 'is', 'anybody', 'how', 'number', 'taking', 'taken', 'the', 'course', 'learning','find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'competencies', 'competency', 'type', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
             querywords = text.split()
             resultwords  = [word for word in querywords if word.lower() not in stopwords]
             entity = ' '.join(resultwords)
             course = entity
             elements = course_learners(text, wid, course, session_id)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0].get('name') == 'people_with_competency':
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             wid = json_object["wid"]
             stopwords = ['get', 'fetch', 'give', 'show', 'learners', 'people', 'list', 'of', 'persons', 'is', 'anybody', 'how', 'number', 'taking', 'taken', 'the', 'course', 'learning','find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'competencies', 'competency', 'type', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
             querywords = text.split()
             resultwords  = [word for word in querywords if word.lower() not in stopwords]
             entity = ' '.join(resultwords)
             competency = entity
             elements = competency_holders(text, competency, session_id)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'add_competency':
             elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : tracker.latest_message['intent'].get('name')}]
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'contact_details':
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             name = ''
             confidence = tracker.latest_message['intent'].get('confidence')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             namee = []
             name = ''
             sender = tracker.sender_id
             stopwords = ['show', 'the', 'contact', 'of', 'get', 'connect', 'profile', 'fetch', 'for', 'a', 'who', 'is', 'an', 'call', 'mail', 'email', 'address', 'adress', 'mobile', 'number', 'phone', 'details', 'information', 'message', 'the', 'who', 'is']
             querywords = text.split()
             resultwords  = [word for word in querywords if word.lower() not in stopwords]
             print(resultwords)
             name = ' '.join(resultwords)     
             print("This is the name" +name)
             elements = fetch_contact_details(name, session_id, entities)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'post_tags':
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             uid = json_object["uid"]
             text = tracker.latest_message.get('text')
             stopwords = ['get', 'fetch', 'give', 'show', 'share', 'are', 'tagged', 'find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'discussions', 'discussions', 'posts', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
             querywords = text.split()
             resultwords  = [word for word in querywords if word.lower() not in stopwords]
             tag = ' '.join(resultwords)
             print(tag)
             elements = get_posts_with_tags(text, tag, uid, session_id)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'competency_list_type':
             print("Im here")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             name = ''
             confidence = tracker.latest_message['intent'].get('confidence')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             namee = []
             name = ''
             sender = tracker.sender_id
             stopwords = ['get', 'fetch', 'give', 'show', 'of', 'share', 'find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'competencies', 'competency', 'type', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
             querywords = text.split()
             resultwords  = [word for word in querywords if word.lower() not in stopwords]
             entity = ' '.join(resultwords)
             print(entity)
             print("")
             elements = competency_type_list(text, entity, session_id)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'courses_completed':
             print('inside "action_courses_completed"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_courses_completed(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'mdos_onboarded':
             print('inside "action_mdos_onboarded"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_mdos_onboarded(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'courses_live_or_draft_or_review':
             print('inside "courses_live_or_draft_or_review"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_courses_live_or_draft_or_review(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'courses_started':
             print('inside "action_courses_started"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_courses_started(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif intent_ranking[0]['name'] == 'users_onboarded':
             print('inside "action_users_onboarded"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_users_onboarded(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'my_connections':
             print('inside "action_getmy_connections"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             print(user_session)
             print(type(user_session))
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             wid = json_object["wid"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = my_connections(text, wid, session_id)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'connection_requests_recieved':
             print('inside "action_getconnection_requests_recieved"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             print(user_session)
             print(type(user_session))
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             wid = json_object["wid"]
             uid = json_object["uid"]
             mdo_id = json_object["mdo_id"]
             elements = get_connection_requests_recieved(text, wid, session_id)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'trending_discussions_posts':
             print('inside "action_gettrending_discussions_posts"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_trending_discussions_posts(text, entities, uid, session_id)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'top_10_courses_by_ratings':
             print('inside "action_top_10_courses_by_ratings"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_top_10_courses_by_ratings(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'top_10_courses_by_completions':
             print('inside "action_top_10_courses_by_completions"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_top_10_courses_by_completions(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'top_10_mdos_by_course_completions':
             print('inside "action_top_10_mdos_by_course_completions"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_top_10_mdos_by_course_completions(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'top_10_mdos_by_users_onboarded':
             print('inside "action_top_10_mdos_by_users_onboarded"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_top_10_mdos_by_users_onboarded(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'top_10_mdos_by_live_courses':
             print('inside "action_top_10_mdos_by_live_courses"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_top_10_mdos_by_live_courses(text, entities, session_id)
             print(elements)
         elif tracker.latest_message['intent'].get('name') == 'user_engagement_by_factor':
             print('inside "action_user_engagement_by_factor"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_user_engagement_by_factor(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'number_of_courses_added':
             print('inside "action_number_of_courses_added"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_number_of_courses_added(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'recent_contents':
             print('inside "action_getrecent_contents"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_recent_content(text, entities, session_id)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'mdo_top_performers':
             print('inside "action_mdo_top_performers"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             uid = json_object["uid"]
             wid = json_object["wid"]
             mdo_id = json_object["mdo_id"]
             elements = get_mdo_top_performers(text, entities, session_id, wid, mdo_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'mdo_top_courses':
             print('inside "action_mdo_top_courses"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             uid = json_object["uid"]
             wid = json_object["wid"]
             mdo_id = json_object["mdo_id"]
             elements = get_mdo_top_courses(text, entities, session_id, wid, mdo_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'mdo_roles':
             print('inside "action_mdo_roles"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             uid = json_object["uid"]
             wid = json_object["wid"]
             mdo_id = json_object["mdo_id"]
             elements = get_mdo_roles(text, entities, session_id, wid, mdo_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'courses_by_provider':
             print('inside "action_getcourses_by_provider"')
             provider = ''
             entities = tracker.latest_message.get('entities')
             entity = ''
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             entity = ''
             if(len(entities) > 0):
                 for ent in entities:
                     if ent['entity'] == 'filter':
                         entity = ent['value']
                     else:
                         stopwords = ['get', 'fetch', 'give', 'show', 'of', 'find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'courses', 'course', 'number', 'no', 'no.', 'numbr', 'the', 'provide', 'provided', 'can', 'you', 'by', 'published', 'live', 'started', 'i', 'm', 'am', 'any', 'is', 'there', 'available', 'from', 'search', 'searching', 'for', 'as']
                         querywords = text.split()
                         resultwords  = [word for word in querywords if word.lower() not in stopwords]
                         entity = ' '.join(resultwords)
             if entity != '':
                 for pro in provider_details:
                     if((entity.lower() in pro.lower()) or (entity.lower() == pro.lower())):
                         print(pro)
                         provider = pro
             elements = get_courses_by_provider(text, provider, session_id)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'cbp_provider_leaderboard':
             print('inside "action_cbp_provider_leaderboard"')
             entities = tracker.latest_message.get('entities')
             text = tracker.latest_message.get('text')
             print("This is the user session")
             user_session = tracker.sender_id
             user_session = user_session.replace("'", '"')
             json_object = json.loads(str(user_session))
             session_id = json_object["jwt"]
             mdo_id = json_object["mdo_id"]
             uid = json_object["uid"]
             elements = get_cbp_provider_leaderboard(text, entities, session_id)
             print(elements)
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'remove_competency':
             elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : tracker.latest_message['intent'].get('name')}]
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'send_connection_request':
             elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : tracker.latest_message['intent'].get('name')}]
             dispatcher.utter_message(json_message=elements)
         elif tracker.latest_message['intent'].get('name') == 'accept_connection_request':
             elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : tracker.latest_message['intent'].get('name')}]
             dispatcher.utter_message(json_message=elements)
         else:
             dispatcher.utter_message(template='utter_low_confidence')
      else :
         dispatcher.utter_message(template='utter_out_of_scope')
         print("no intent detected")

################################################################ migrated apis START ##################


class getContactDetails(Action):
   def name(self):
      return "action_getcontact_details"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getcontact_details"')
      name = ''
      confidence = tracker.latest_message['intent'].get('confidence')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      namee = []
      name = ''
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      stopwords = ['show', 'the', 'contact', 'of', 'get', 'connect', 'profile', 'fetch', 'for', 'a', 'who', 'is', 'an', 'call', 'mail', 'email', 'address', 'adress', 'mobile', 'number', 'phone', 'details', 'information', 'message', 'the', 'who', 'is']
      querywords = text.split()
      resultwords  = [word for word in querywords if word.lower() not in stopwords]
      print(resultwords)
      name = ' '.join(resultwords)     
      print("This is the name" +name)
      result = fetch_contact_details(name, session_id, entities)
      dispatcher.utter_message(json_message=result)
      return []



class getRecentContents(Action):
   def name(self):
      return "action_getrecent_contents"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getrecent_contents"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      elements = get_recent_content(text, entities, session_id)
      dispatcher.utter_message(json_message=elements)
      return []
      
      



class getRecentDiscussions(Action):
   def name(self):
      return "action_getrecent_discussions"
   def run(self, dispatcher, tracker, domain):
      print('inside "action_getrecent_discussions"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_recent_discussions(text, entities, uid, session_id)
      dispatcher.utter_message(json_message=elements)
      return []

class getTrendingDiscussionsPosts(Action):
   def name(self):
      return "action_gettrending_discussions_posts"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_gettrending_discussions_posts"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_trending_discussions_posts(text, entities, uid, session_id)
      dispatcher.utter_message(json_message=elements)
      return []

class getUpvotedDiscussions(Action):
   def name(self):
      return "action_getupvoted_discussions"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getupvoted_discussions"')
      entities = tracker.latest_message.get('entities')
      session_id = tracker.sender_id
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      username = json_object["username"]
      elements = get_upvoted_discussions(text, entities, uid, username, session_id)
      dispatcher.utter_message(json_message=elements)
      return []

class getPostTags(Action):
   def name(self):
      return "action_getpost_tags"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getpost_tags"')
      entities = tracker.latest_message.get('entities')
      session_id = tracker.sender_id
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      stopwords = ['get', 'fetch', 'give', 'show', 'share', 'find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'discussions', 'discussions', 'posts', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
      querywords = text.split()
      resultwords  = [word for word in querywords if word.lower() not in stopwords]
      tag = ' '.join(resultwords)
      elements = get_posts_with_tags(text, tag, uid, session_id)
      dispatcher.utter_message(json_message=elements)
      return []

class GetPostsTags(FormAction):

    def name(self):
        # type: () -> Text
        return "get_posts_tags_form"

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:

        return ["tag"]
    def submit(self,
               dispatcher: CollectingDispatcher,
               tracker: Tracker,
               domain: Dict[Text, Any]) -> List[Dict]:
        # utter submit template
        user_session = tracker.sender_id
        user_session = user_session.replace("'", '"')
        json_object = json.loads(str(user_session))
        session_id = json_object["jwt"]
        uid = json_object["uid"]
        tag = tracker.get_slot("tag")
        elements = get_posts_with_tags(text, tag, uid, session_id)
        dispatcher.utter_message(json_message=elements)
        return []

class getCoursesByProvider(Action):
   def name(self):
      return "action_getcourses_by_provider"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getcourses_by_provider"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      entity = ''
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      if(len(entities) > 0):
          for ent in entities:
              if ent['entity'] == 'filter':
                  entity = ent['value']
              else:
                  stopwords = ['get', 'fetch', 'give', 'show', 'of', 'find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'courses', 'course', 'number', 'no', 'no.', 'numbr', 'the', 'provide', 'provided', 'can', 'you', 'by', 'published', 'live', 'started', 'i', 'm', 'am', 'any', 'is', 'there', 'available', 'from', 'search', 'searching', 'for', 'as']
                  querywords = text.split()
                  resultwords  = [word for word in querywords if word.lower() not in stopwords]
                  entity = ' '.join(resultwords)
      if entity != '':
          for pro in provider_details:
              if((entity.lower() in pro.lower()) or (entity.lower() == pro.lower())):
                  print(pro)
                  provider = pro
      elements = get_courses_by_provider(text, provider, session_id)
      dispatcher.utter_message(json_message=elements)
      return []
      

      
class getCompetencyListType(Action):
   def name(self):
      return "action_getcompetency_list_type"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getcompetency_list_type"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      stopwords = ['get', 'fetch', 'give', 'show', 'of', 'share', 'find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'competencies', 'competency', 'type', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
      querywords = text.split()
      resultwords  = [word for word in querywords if word.lower() not in stopwords]
      entity = ' '.join(resultwords)
      print(entity)
      print("This was the entity")
      elements = competency_type_list(text, entity, session_id)
      dispatcher.utter_message(json_message=elements)
      return []
      

class CompetencyListType(FormAction):

    def name(self):
        # type: () -> Text
        return "competency_list_type_form"

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:

        return ["competencytype"]
    def submit(self,
               dispatcher: CollectingDispatcher,
               tracker: Tracker,
               domain: Dict[Text, Any]) -> List[Dict]:
        # utter submit template
        user_session = tracker.sender_id
        user_session = user_session.replace("'", '"')
        json_object = json.loads(str(user_session))
        session_id = json_object["jwt"]
        uid = json_object["uid"]
        ctype = tracker.get_slot("competencytype")
        elements = competency_type_list(text, ctype, session_id)
        dispatcher.utter_message(json_message=elements)
        return []

class getCbpMatchesToMyCompetencies(Action):
   def name(self):
      return "action_getcbp_matches_to_my_competencies"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getcbp_matches_to_my_competencies"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      wid = json_object["wid"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = cbp_matches_to_competency(text, wid, session_id)
      dispatcher.utter_message(json_message=elements)
      return []

class getLearningCourse(Action):
   def name(self):
      return "action_getlearning_course"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_learning_course"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      wid = json_object["wid"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      stopwords = ['get', 'fetch', 'give', 'show', 'learners', 'people', 'list', 'of', 'persons', 'is', 'anybody', 'how', 'number', 'taking', 'taken', 'the', 'course', 'learning','find', 'that', 'many', 'how', 'has', 'have', 'me', 'a', 'on', 'with', 'competencies', 'competency', 'type', 'post', 'tag', 'tags', 'the', 'provide', 'need', 'can', 'you']
      querywords = text.split()
      resultwords  = [word for word in querywords if word.lower() not in stopwords]
      entity = ' '.join(resultwords)
      course = entity
      elements = course_learners(text, wid, course, session_id)
      dispatcher.utter_message(json_message=elements)
      return []


class CourseLearnersForm(FormAction):

    def name(self):
        # type: () -> Text
        return "course_learners_form"

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:

        return ["course"]
    def submit(self,
               dispatcher: CollectingDispatcher,
               tracker: Tracker,
               domain: Dict[Text, Any]) -> List[Dict]:
        # utter submit template
        user_session = tracker.sender_id
        user_session = user_session.replace("'", '"')
        json_object = json.loads(str(user_session))
        session_id = json_object["jwt"]
        wid = json_object["wid"]
        course = tracker.get_slot("course")
        elements = course_learners(text, wid, course, session_id)
        dispatcher.utter_message(json_message=elements)
        return []
        

class getPeopleWithCompetency(Action):
   def name(self):
      return "action_getpeople_with_competency"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getpeople_with_competency"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      wid = json_object["wid"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      competency = 'Budget analysis'
      elements = competency_holders(text, competency, session_id)
      dispatcher.utter_message(json_message=elements)
      return []
      
class getCoursesCompleted(Action):
   def name(self):
      return "action_courses_completed"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_courses_completed"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_courses_completed(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      
class getMdosOnboarded(Action):
   def name(self):
      return "action_mdos_onboarded"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_mdos_onboarded"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_mdos_onboarded(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []

class getMdosOnboarded(Action):
   def name(self):
      return "action_user_engagement_by_factor"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_user_engagement_by_factor"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_user_engagement_by_factor(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []

class getCoursesAdded(Action):
   def name(self):
      return "action_number_of_courses_added"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_number_of_courses_added"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_number_of_courses_added(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      

class getTop10CoursesByRatings(Action):
   def name(self):
      return "action_top_10_courses_by_ratings"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_top_10_courses_by_ratings"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_top_10_courses_by_ratings(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      

class getTop10MdosByCourseCompletions(Action):
   def name(self):
      return "action_top_10_mdos_by_course_completions"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_top_10_mdos_by_course_completions"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_top_10_mdos_by_course_completions(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      
      
class getTop10CoursesByCompletions(Action):
   def name(self):
      return "action_top_10_courses_by_completions"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_top_10_courses_by_completions"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_top_10_courses_by_completions(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []






class getCoursesLiveOrDraftOrReview(Action):
   def name(self):
      return "action_courses_live_or_draft_or_review"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_courses_live_or_draft_or_review"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_courses_live_or_draft_or_review(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []


class getCoursesStarted(Action):
   def name(self):
      return "action_courses_started"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_courses_started"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_courses_started(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []

class getUsersOnboarded(Action):
   def name(self):
      return "action_courses_started"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_users_onboarded"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_users_onboarded(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      

class getCBPProviderLeaderboard(Action):
   def name(self):
      return "action_cbp_provider_leaderboard"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_cbp_provider_leaderboard"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      elements = get_cbp_provider_leaderboard(text, entities, session_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      
class getMdoTopPerformers(Action):
   def name(self):
      return "action_mdo_top_performers"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_mdo_top_performers"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      wid = json_object["wid"]
      elements = get_mdo_top_performers(text, entities, session_id, wid, mdo_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      
class getMdoTopCourses(Action):
   def name(self):
      return "action_mdo_top_courses"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_mdo_top_performers"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      wid = json_object["wid"]
      elements = get_mdo_top_courses(text, entities, session_id, wid, mdo_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []
      
class getMdoRoles(Action):
   def name(self):
      return "action_mdo_roles"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_mdo_top_performers"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      wid = json_object["wid"]
      elements = get_mdo_roles(text, entities, session_id, wid, mdo_id)
      print(elements)
      dispatcher.utter_message(json_message=elements)
      return []

class getMyConnections(Action):
   def name(self):
      return "action_getmy_connections"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getmy_connections"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      print(user_session)
      print(type(user_session))
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      wid = json_object["wid"]
      elements = my_connections(text, wid, session_id)
      dispatcher.utter_message(json_message=elements)
      return []

class getMyConnectionRequests(Action):
   def name(self):
      return "action_getconnection_requests_recieved"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getconnection_requests_recieved"')
      entities = tracker.latest_message.get('entities')
      text = tracker.latest_message.get('text')
      print("This is the user session")
      user_session = tracker.sender_id
      user_session = user_session.replace("'", '"')
      print(user_session)
      print(type(user_session))
      json_object = json.loads(str(user_session))
      session_id = json_object["jwt"]
      uid = json_object["uid"]
      mdo_id = json_object["mdo_id"]
      wid = json_object["wid"]
      elements = get_connection_requests_recieved(text, wid, session_id)
      dispatcher.utter_message(json_message=elements)
      return []
      
      
      
      
class PeopleWithCompetency(FormAction):

    def name(self):
        # type: () -> Text
        return "people_with_competency_form"

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:

        return ["competency"]
    def submit(self,
               dispatcher: CollectingDispatcher,
               tracker: Tracker,
               domain: Dict[Text, Any]) -> List[Dict]:
        # utter submit template
        user_session = tracker.sender_id
        user_session = user_session.replace("'", '"')
        json_object = json.loads(str(user_session))
        session_id = json_object["jwt"]
        wid = json_object["wid"]
        uid = json_object["uid"]
        mdo_id = json_object["mdo_id"]        
        competency = tracker.get_slot("competency")
        elements = competency_holders(text, competency, session_id)
        dispatcher.utter_message(json_message=elements)
        return []



################################################################ migrated apis END ##################


########################### not required right now START###########################################

class getSendConnectionRequest(Action):
   def name(self):
      return "action_getsend_connection_request"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getsend_connection_request"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getAcceptConnectionRequest(Action):
   def name(self):
      return "action_accept_connection_request"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getaccept_connection_request"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"contact","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)


class getAddCompetency(Action):
   def name(self):
      return "action_getadd_competency"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getadd_competency"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getRemoveCompetency(Action):
   def name(self):
      return "action_getremove_competency"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getremove_competency"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)


########################### not required right now END ###########################################


class getTrendingtags(Action):
   def name(self):
      return "action_gettrending_tags"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_gettrending_tags"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"tags","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)
     

class getAllTags(Action):
   def name(self):
      return "action_getall_tags"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getposttags"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"tags","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)





