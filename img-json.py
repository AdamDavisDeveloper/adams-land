import os
import json
import sys

def generate_json(directories):
    extensions = ('.gif', '.webp', '.jpg', '.jpeg', '.png')
    all_files = []

    for directory in directories:
        files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f)) and f.lower().endswith(extensions)]
        all_files.extend([os.path.join(directory, f) for f in files])

    all_files.sort()

    with open('images.json', 'w') as json_file:
        json.dump(all_files, json_file, indent=4)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python generate_json.py <directory1> <directory2> ...")
        sys.exit(1)
    directories = sys.argv[1:]
    generate_json(directories)

