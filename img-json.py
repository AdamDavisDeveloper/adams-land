import os
import json
import sys

def generate_json(directories):
    # Define the list of acceptable image extensions
    extensions = ('.gif', '.webp', '.jpg', '.jpeg', '.png')
    all_files = []

    for directory in directories:
        # List all files in each directory that end with a valid image extension
        files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f)) and f.lower().endswith(extensions)]
        # Extend the all_files list with the found files, prefixed by directory
        all_files.extend([os.path.join(directory, f) for f in files])

    # Sort all_files alphabetically
    all_files.sort()

    # Create a JSON file containing these files
    with open('images.json', 'w') as json_file:
        json.dump(all_files, json_file, indent=4)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python generate_json.py <directory1> <directory2> ...")
        sys.exit(1)
    directories = sys.argv[1:]
    generate_json(directories)

