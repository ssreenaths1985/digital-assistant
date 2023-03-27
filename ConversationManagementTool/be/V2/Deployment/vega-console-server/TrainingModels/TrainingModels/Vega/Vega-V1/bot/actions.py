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


class FallbackAction(Action):
   def name(self):
      return "fallback_action"

   def run(self, dispatcher, tracker, domain):
      print('inside "fallback_action"')
      intent_ranking = tracker.latest_message.get('intent_ranking', [])
      print(intent_ranking)
      if len(intent_ranking) > 0 :
         term = tracker.latest_message['text']
         word_list = term.split()
         number_of_words = len(word_list)
         if(number_of_words <= 3):
            if tracker.latest_message['intent'].get('confidence') < 0.35 :
               dispatcher.utter_message(template='utter_out_of_scope')
            else :
               elements = [{"type":"course","intent" : "term_search", "term" : term}]
               dispatcher.utter_message(json_message=elements)
         else:
            dispatcher.utter_message(template='utter_low_confidence')
      else :
         dispatcher.utter_message(template='utter_out_of_scope')
         print("no intent detected")

class getAllTags(Action):
   def name(self):
      return "action_getall_tags"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getposttags"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"tags","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getTrendingDiscussions(Action):
   def name(self):
      return "action_gettrending_discussions"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_gettrending_discussions"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"discussions","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getRecentDiscussions(Action):
   def name(self):
      return "action_getrecent_discussions"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getrecent_discussions"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"discussions","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)


class ContactForm(FormAction):
    """Example of a custom form action"""

    def name(self):
        """Unique identifier of the form"""
        return "contact_form"
    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        """A list of required slots that the form has to fill"""
        return ["firstname", "department"]

    def submit(self, dispatcher, tracker, domain):
        """Define what the form has to do
            	after all required slots are filled"""
        print(tracker.latest_message.get('entities'))
        intent = tracker.latest_message['intent'].get('name')
       	elements = [{"type":"contact","entities":tracker.latest_message.get('entities'), "intent" : intent}]
        dispatcher.utter_message(json_message=elements)
        return[SlotSet("firstname", None), SlotSet("department", None)]

class LearningCourseForm(FormAction):
    """Example of a custom form action"""

    def name(self):
        """Unique identifier of the form"""
        return "learning_course_form"
    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        """A list of required slots that the form has to fill"""
        return ["course"]
    def submit(self, dispatcher, tracker, domain):
        """Define what the form has to do
            	after all required slots are filled"""
        print(tracker.latest_message.get('entities'))
        intent = tracker.latest_message['intent'].get('name')
       	elements = [{"type":"list","entities":tracker.latest_message.get('entities'), "intent" : intent}]
        dispatcher.utter_message(json_message=elements)
        return [SlotSet("course", None)]


class AddCompetencyForm(FormAction):
    """Example of a custom form action"""

    def name(self):
        """Unique identifier of the form"""
        return "add_competency_form"
    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        """A list of required slots that the form has to fill"""
        return ["competency"]
    def submit(self, dispatcher, tracker, domain):
        """Define what the form has to do
            	after all required slots are filled"""
        print(tracker.latest_message.get('entities'))
        intent = tracker.latest_message['intent'].get('name')
       	elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : intent}]
        dispatcher.utter_message(json_message=elements)
        return [SlotSet("competency", None)]

class RemoveCompetencyForm(FormAction):
    """Example of a custom form action"""

    def name(self):
        """Unique identifier of the form"""
        return "remove_competency_form"
    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        """A list of required slots that the form has to fill"""
        return ["competency"]
    def submit(self, dispatcher, tracker, domain):
        """Define what the form has to do
            	after all required slots are filled"""
        print(tracker.latest_message.get('entities'))
        intent = tracker.latest_message['intent'].get('name')
       	elements = [{"type":"direct","entities":tracker.latest_message.get('entities'), "intent" : intent}]
        dispatcher.utter_message(json_message=elements)
        return [SlotSet("competency", None)]

class getMyConnections(Action):
   def name(self):
      return "action_getmy_connections"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getmy_connections"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"contact","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getLearningCourse(Action):
   def name(self):
      return "action_getlearning_course"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_learning_course"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"list","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getRecentContents(Action):
   def name(self):
      return "action_getrecent_contents"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getrecent_contents"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"course","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class SearchContentByFilter(Action):
   def name(self):
      return "action_search_content_by_filter"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_search_content_by_filter"')
      intent = tracker.latest_message['intent'].get('name')
      entity = tracker.latest_message.get('entities')
      elements = [{"type":"course","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getTrendingtags(Action):
   def name(self):
      return "action_gettrending_tags"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_gettrending_tags"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"tags","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)

class getCbpMatchesToMyCompetencies(Action):
   def name(self):
      return "action_getcbp_matches_to_my_competencies"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getcbp_matches_to_my_competencies"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"course","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)


class getUpvotedDiscussions(Action):
   def name(self):
      return "action_getupvoted_discussions"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getupvoted_discussions"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"updiscussions","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)


class getCompetencyListType(Action):
   def name(self):
      return "action_getcompetency_list_type"

   def run(self, dispatcher, tracker, domain):
      print('inside "action_getcompetency_list_type"')
      intent = tracker.latest_message['intent'].get('name')
      elements = [{"type":"list","entities":tracker.latest_message.get('entities'), "intent" : intent}]
      dispatcher.utter_message(json_message=elements)




