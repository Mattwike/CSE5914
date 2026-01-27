from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/data')

def get_data():
    return jsonify(name="Flask", version="1.0", language="Python")


if __name__ == "__main__":
    app.run(debug=True)
