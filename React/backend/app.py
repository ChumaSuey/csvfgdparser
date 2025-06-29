# filepath: c:\Users\luism\PycharmProjects\FGDcsvparser\FGDcsvparser\React\backend\app.py
from csv_writer import write_details_to_csv
from fgd_parser import parse_fgd
from utils import get_unique_file_name
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Flask backend!'})

@app.route('/api/visualize', methods=['POST'])
def visualize():
    try:
        print("Received request")
        file = request.files['file']
        class_type = request.form.get('classType', 'All')
        print(f"Class type: {class_type}")

        with tempfile.NamedTemporaryFile(delete=False, suffix='.fgd') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
        print(f"Saved file to {tmp_path}")

        solid, point, base = parse_fgd(tmp_path)
        print("Parsed FGD")

        result = {}
        if class_type == 'Solid':
            result['solid'] = solid
        elif class_type == 'Point':
            result['point'] = point
        elif class_type == 'Base':
            result['base'] = base
        else:
            result = {'solid': solid, 'point': point, 'base': base}

        os.remove(tmp_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/create-csv', methods=['POST'])
def create_csv():
    try:
        file = request.files['file']
        class_type = request.form.get('classType', 'All')

        with tempfile.NamedTemporaryFile(delete=False, suffix='.fgd') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        solid, point, base = parse_fgd(tmp_path)

        data = []
        fieldnames = ['Entity', 'Type']
        if class_type == 'Solid':
            for entity in solid:
                data.append({'Entity': entity, 'Type': 'Solid'})
        elif class_type == 'Point':
            for entity in point:
                data.append({'Entity': entity, 'Type': 'Point'})
        elif class_type == 'Base':
            for entity in base:
                data.append({'Entity': entity, 'Type': 'Base'})
        else:
            for entity in solid:
                data.append({'Entity': entity, 'Type': 'Solid'})
            for entity in point:
                data.append({'Entity': entity, 'Type': 'Point'})
            for entity in base:
                data.append({'Entity': entity, 'Type': 'Base'})

        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv', mode='w', encoding='utf-8', newline='') as csv_tmp:
            write_details_to_csv(csv_tmp.name, data, fieldnames)
            csv_path = csv_tmp.name

        os.remove(tmp_path)
        return send_file(csv_path, as_attachment=True, download_name='entities.csv')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)