#!/usr/bin/env python
import rospy 
from std_msgs.msg import String
import requests
import json

src = '/home/badra/ros_ws/Web_ws/src/robothub_api/src/node/data.json'

rospy.init_node('badra')
topics = []
def list_to_json(data):
    newdata = {"topics":[]}
    for x in data:
        newdata["topics"].append({"name":x[0],"type":x[1]})
    return newdata

# res =  requests.get('http://localhost:3000/checktopic')
def set_topics(data):
    jsondata = list_to_json(data)
    print(json.dumps(jsondata))
    with open(src, 'w') as outfile:  
        json.dump(jsondata, outfile,indent=2)
    return 0


rate =rospy.Rate(2)

while not rospy.is_shutdown():
    tmp = rospy.get_published_topics('/')
    if tmp != topics:
        res =  requests.get('http://localhost:3000/stop')
        topics = tmp
        set_topics(topics)
    rate.sleep()



