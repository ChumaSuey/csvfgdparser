import csv
import re
import os

def parse_fgd(file_path):
    solid_details = []
    point_details = []
    base_details = []

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            for line in file:
                try:
                    if line.startswith('@SolidClass'):
                        match = re.search(r'@SolidClass.*?=\s*(\w+)\s*:\s*"([^"]*)"', line)
                        if match:
                            solid_details.append(f"- {match.group(1)} : \"{match.group(2)}\"")
                    elif line.startswith('@PointClass'):
                        match = re.search(r'@PointClass.*?=\s*(\w+)\s*:\s*"([^"]*)"', line)
                        if match:
                            point_details.append(f"- {match.group(1)} : \"{match.group(2)}\"")
                    elif line.startswith('@baseclass'):
                        match = re.search(r'@baseclass.*?=\s*(\w+)', line)
                        if match:
                            base_details.append(f"- {match.group(1)}")
                except re.error as e:
                    print(f"Regex error: {e}")
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except IOError as e:
        print(f"IO error: {e}")

    return solid_details, point_details, base_details

def get_unique_file_name(base_name):
    counter = 1
    file_name = base_name
    while os.path.exists(file_name):
        file_name = f"{os.path.splitext(base_name)[0]}({counter}){os.path.splitext(base_name)[1]}"
        counter += 1
    return file_name

def write_details_to_csv(solid_details, point_details, base_details, detail_file):
    detail_file = get_unique_file_name(detail_file)
    try:
        with open(detail_file, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['ClassType', 'Details'])
            for detail in solid_details:
                writer.writerow(['Solid', detail])
            writer.writerow([])  # Add a blank line after the last Solid entry
            for detail in point_details:
                writer.writerow(['Point', detail])
            writer.writerow([])  # Add a blank line after the last Point entry
            for detail in base_details:
                writer.writerow(['Base', detail])
        print(f"Details CSV file has been created at {detail_file}")
    except IOError as e:
        print(f"IO error: {e}")

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_directory, 'your_fgd_file.fgd')
    detail_file = os.path.join(current_directory, 'output', 'details.csv')

    solid_details, point_details, base_details = parse_fgd(input_file)
    write_details_to_csv(solid_details, point_details, base_details, detail_file)