import csv
import os
import re

import re

def parse_fgd(file_path):
    solid_details = []
    point_details = []
    base_details = []
    solid_classes_set = set()
    point_classes_set = set()
    base_classes_set = set()

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
            solid_classes = re.findall(r'@SolidClass.*?=\s*(\w+)\s*:\s*"([^"]*)"\s*\[(.*?)\]', content, re.DOTALL)
            point_classes = re.findall(r'@PointClass.*?=\s*(\w+)\s*:\s*"([^"]*)"\s*\[(.*?)\]', content, re.DOTALL)
            base_classes = re.findall(r'@baseclass.*?=\s*(\w+)\s*\[(.*?)\]', content, re.DOTALL)

            for match in solid_classes:
                class_name, description, properties = match
                if class_name not in solid_classes_set:
                    solid_classes_set.add(class_name)
                    solid_details.append(f"- {class_name} : \"{description}\"")
                    solid_details.append(f"  Properties: {properties.strip()}")

            for match in point_classes:
                class_name, description, properties = match
                if class_name not in point_classes_set:
                    point_classes_set.add(class_name)
                    point_details.append(f"- {class_name} : \"{description}\"")
                    point_details.append(f"  Properties: {properties.strip()}")

            for match in base_classes:
                class_name, properties = match
                if class_name not in base_classes_set:
                    base_classes_set.add(class_name)
                    base_details.append(f"- {class_name}")
                    base_details.append(f"  Properties: {properties.strip()}")

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

            # Write entity counts at the beginning
            writer.writerow([
                                f"Solid Classes: {len(solid_details)}, Point Classes: {len(point_details)}, Base Classes: {len(base_details)}"])
            writer.writerow([])  # Add a blank line after the counts

            writer.writerow(['ClassType', 'Details'])
            for detail in solid_details:
                writer.writerow(['Solid', detail])
            writer.writerow([])  # Add a blank line after the last Solid entry
            for detail in point_details:
                writer.writerow(['Point', detail])
            writer.writerow([])  # Add a blank line after the last Point entry
            for detail in base_details:
                writer.writerow(['Base', detail])
            writer.writerow([])  # Add a blank line after the last Base entry

        print(f"Details CSV file has been created at {detail_file}")
        print(f"Solid Count: {len(solid_details)}")
        print(f"Point Count: {len(point_details)}")
        print(f"Base Count: {len(base_details)}")
    except IOError as e:
        print(f"IO error: {e}")


if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_directory, 'your_fgd_file.fgd')
    detail_file = os.path.join(current_directory, 'output', 'details.csv')

    solid_details, point_details, base_details = parse_fgd(input_file)
    write_details_to_csv(solid_details, point_details, base_details, detail_file)