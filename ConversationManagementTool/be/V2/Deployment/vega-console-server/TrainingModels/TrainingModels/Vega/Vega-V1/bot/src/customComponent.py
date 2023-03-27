from rasa.nlu.components import Component
from typing import Any, Optional, Text, Dict
import re

class MyComponent(Component):

    def __init__(self, component_config=None):
        super().__init__(component_config)

    def train(self, training_data, cfg, **kwargs):
        print('custom train component called')
        pass

    def process(self, message, **kwargs):
        print('custom process component called-------------------------------------------------')
        print(message.text)
        if(message.text == "Hii" or message.text == "Hiiee" or message.text == "Hy" or message.text == "Hiiee" or message.text == "Heyy" or message.text == "Hola"):
            message.text = "hi";
        LBSNAA = ['l b s n n a a','labasna','labaasnaa','labasana','lbs','LBS','LBSN', 'LBSNAA']
        if any(i in message.text for i in LBSNAA): 
            value = "";
            for i in LBSNAA:
                print("====================")
                if i in message.text:
                    print(i)
                    value = i;
            message.text = message.text.replace(value, "LBSNAA")
            print(message.text)   
        pass

    def persist(self, file_name: Text, model_dir: Text) -> Optional[Dict[Text, Any]]:
        print('custom persist component called')
        pass

