# Imports
import os,json
from flask import Flask
from flask import Flask,render_template,request
import numpy as np
import sys,site

from flask_cors import CORS



# Initial level flask configuration
print("the file path is {0}".format(os.path.dirname(os.path.abspath(__file__))))
template_dir = os.path.dirname(os.path.abspath(__file__)) + '/static'
print("The template dir is {0}".format(template_dir))
app = Flask(__name__,static_folder=template_dir,template_folder=template_dir)
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})

# Read the BreakOut Model
#breakOutModel = load_model('breakOut_model')

#app = Flask(__name__)

#@app.route('/')
#def hello_world():
#  return 'Hello from Flask!'

@app.route('/')
def hello_world():
    #return render_template('index.html')
    return("ABC")


@app.route('/getImagePrediction', methods=["GET","POST"])
def getImagePrediction():
    print("Received the reqest in flaskapp")
    print(request)
    print(request.args.get('data'))
    return(json.dumps({"prediction_results":"Laughing"}))


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=False)

