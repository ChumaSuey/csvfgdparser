import csv
import os
import re

def find_fgd_file(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.fgd'):
                return os.path.join(root, file)
    return None

def parse_fgd(file_path):
    solid_classes = []
    point_classes = []
    base_classes = {}
    solid_details = []
    point_details = []
    base_details = []

    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith('@SolidClass'):
                solid_classes.append(line.strip())
                match = re.search(r'@SolidClass.*?=\s*(\w+)\s*:\s*"([^"]*)"', line)
                if match:
                    solid_details.append(f"- {match.group(1)} : \"{match.group(2)}\"")
            elif line.startswith('@PointClass'):
                point_classes.append(line.strip())
                match = re.search(r'@PointClass.*?=\s*(\w+)\s*:\s*"([^"]*)"', line)
                if match:
                    point_details.append(f"- {match.group(1)} : \"{match.group(2)}\"")
            elif line.startswith('@baseclass'):
                match = re.search(r'@baseclass\s*=\s*(\w+)\s*\[', line)
                if match:
                    class_name = match.group(1)
                    base_classes[class_name] = []
                    for detail_line in file:
                        if detail_line.strip() == ']':
                            break
                        base_classes[class_name].append(detail_line.strip())
                    base_details.append(f"- {class_name} : {base_classes[class_name]}")

    return solid_classes, point_classes, base_classes, solid_details, point_details, base_details

def write_to_csv(solid_classes, point_classes, base_classes, output_file):
    with open(output_file, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['SolidClass'])
        for solid_class in solid_classes:
            writer.writerow([solid_class])
        writer.writerow([])
        writer.writerow(['PointClass'])
        for point_class in point_classes:
            writer.writerow([point_class])
        writer.writerow([])
        writer.writerow(['BaseClass'])
        for base_class in base_classes:
            writer.writerow([base_class])

def write_details_to_csv(solid_details, point_details, base_details, detail_file):
    with open(detail_file, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['SolidClass'])
        for detail in solid_details:
            writer.writerow([detail])
        writer.writerow([])
        writer.writerow(['PointClass'])
        for detail in point_details:
            writer.writerow([detail])
        writer.writerow([])
        writer.writerow(['BaseClass'])
        for detail in base_details:
            writer.writerow([detail])

def get_unique_output_file(directory, base_name='output', extension='.csv'):
    counter = 1
    output_file = os.path.join(directory, f"{base_name}{extension}")
    while os.path.exists(output_file):
        output_file = os.path.join(directory, f"{base_name}({counter}){extension}")
        counter += 1
    return output_file

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    input_file = find_fgd_file(current_directory)

    if input_file:
        output_file = get_unique_output_file(current_directory)
        detail_file = get_unique_output_file(current_directory, base_name='detail')
        solid_classes, point_classes, base_classes, solid_details, point_details, base_details = parse_fgd(input_file)
        write_to_csv(solid_classes, point_classes, base_classes, output_file)
        write_details_to_csv(solid_details, point_details, base_details, detail_file)
        print(f"CSV files have been created at {output_file} and {detail_file}")
    else:
        print("No .fgd file found in the current directory.")