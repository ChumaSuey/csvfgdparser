import csv
from typing import List, Dict, Any

def write_details_to_csv(file_path: str, data: List[Dict[str, Any]], fieldnames: List[str]) -> None:
    """
    Writes a list of dictionaries to a CSV file.

    :param file_path: Path to the output CSV file.
    :param data: List of dictionaries containing row data.
    :param fieldnames: List of column names for the CSV.
    """
    with open(file_path, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)