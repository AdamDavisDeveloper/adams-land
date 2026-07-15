import os
import json
import sys

def to_public_relative(path):
    normalized = path.replace('\\', '/')
    if normalized.startswith('public/'):
        return normalized[len('public/'):]
    return normalized

def generate_json(directories):
    extensions = ('.gif', '.webp', '.jpg', '.jpeg', '.png')
    all_files = []

    for directory in directories:
        files = [
            f for f in os.listdir(directory)
            if os.path.isfile(os.path.join(directory, f)) and f.lower().endswith(extensions)
        ]
        all_files.extend([os.path.join(directory, f) for f in files])

    public_relative_paths = sorted(to_public_relative(path) for path in all_files)

    output_path = os.path.join('public', 'images.json')
    with open(output_path, 'w') as json_file:
        json.dump(public_relative_paths, json_file, indent=4)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 img-json.py <directory1> <directory2> ...")
        sys.exit(1)
    directories = sys.argv[1:]
    generate_json(directories)
