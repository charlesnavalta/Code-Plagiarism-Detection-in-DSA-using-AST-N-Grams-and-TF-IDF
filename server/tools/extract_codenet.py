"""
=============================================================================
Project CodeNet Submissions Extractor for Falsicode Plagiarism Detection
=============================================================================
This tool streams directly from IBM's Project CodeNet benchmarks
(Python800 or Java250) and extracts only the desired number of student
submissions for any given problem into your server/datasets/ directory.

Zero 30GB archive download required!
=============================================================================
"""

import os
import sys
import argparse
import urllib.request
import tarfile

PYTHON800_URL = "https://codait-cos-dax.s3.us.cloud-object-storage.appdomain.cloud/dax-project-codenet/1.0.0/Project_CodeNet_Python800.tar.gz"
JAVA250_URL = "https://codait-cos-dax.s3.us.cloud-object-storage.appdomain.cloud/dax-project-codenet/1.0.0/Project_CodeNet_Java250.tar.gz"

# Point BASE_DIR to server/ (parent directory of tools/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def extract_problem(language="python", problem_id="p02709", count=20, output_dir=None):
    lang = language.lower()
    if lang == "python":
        url = PYTHON800_URL
        ext = ".py"
        folder_name = "python_source-code"
    elif lang == "java":
        url = JAVA250_URL
        ext = ".java"
        folder_name = "java_source-code"
    else:
        print(f"Error: Unsupported language '{language}'. Choose 'python' or 'java'.")
        return

    if not output_dir:
        output_dir = os.path.join(BASE_DIR, "datasets", folder_name, f"codenet_{problem_id}")

    os.makedirs(output_dir, exist_ok=True)
    print(f"Connecting to IBM Project CodeNet stream for {lang.capitalize()}...")
    print(f"Target Problem: {problem_id} (Extracting {count} submissions)")
    print(f"Output Directory: {output_dir}")

    saved = 0
    try:
        with urllib.request.urlopen(url) as resp:
            with tarfile.open(fileobj=resp, mode="r|gz") as tar:
                for member in tar:
                    if member.isfile() and problem_id in member.name and member.name.endswith(ext):
                        fname = os.path.basename(member.name)
                        dest = os.path.join(output_dir, fname)
                        f = tar.extractfile(member)
                        if f:
                            with open(dest, "wb") as out_f:
                                out_f.write(f.read())
                            saved += 1
                            print(f"  [{saved}/{count}] Saved {fname}")
                            if saved >= count:
                                break
        print(f"\n[DONE] Successfully saved {saved} {lang.capitalize()} submissions to:")
        print(f"       {output_dir}")
    except Exception as e:
        print(f"\n[ERROR] An error occurred: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract Project CodeNet DSA submissions directly.")
    parser.add_argument("--lang", default="python", choices=["python", "java"], help="Language: python or java")
    parser.add_argument("--problem", default="p02709", help="Problem ID (e.g. p02709 for Python, p02981 for Java)")
    parser.add_argument("--count", type=int, default=20, help="Number of submissions to extract (default: 20)")
    parser.add_argument("--output", default=None, help="Custom output directory")
    args = parser.parse_args()

    extract_problem(language=args.lang, problem_id=args.problem, count=args.count, output_dir=args.output)
