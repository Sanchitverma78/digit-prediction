from flask import Flask, render_template,request,jsonify
from modelHandler import predict
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/predict',methods=['POST'])
def api_predict():
    req = request.json['imageData']   
    prediction = predict(req)
    return jsonify({'pred_val':prediction[0]})