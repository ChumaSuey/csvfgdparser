import os
import uuid

def get_unique_file_name(directory: str, base_name: str, extension: str) -> str:
    """
    Generates a unique file name in the specified directory.

    :param directory: Directory to check for existing files.
    :param base_name: Base name for the file (without extension).
    :param extension: File extension (e.g., 'csv').
    :return: Unique file path as a string.
    """
    while True:
        unique_id = uuid.uuid4().hex[:8]
        file_name = f"{base_name}_{unique_id}.{extension}"
        file_path = os.path.join(directory, file_name)
        if not os.path.exists(file_path):
            return file_path