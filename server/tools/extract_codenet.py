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


def extract_problems(language="python", problem_ids=None, count=20, output_base=None, min_lines=0, clear_existing=False):
    if problem_ids is None:
        problem_ids = ["p02709"]
    elif isinstance(problem_ids, str):
        problem_ids = [p.strip() for p in problem_ids.split(",") if p.strip()]

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

    if not output_base:
        output_base = os.path.join(BASE_DIR, "datasets", "github_codenet_datasets", lang)

    # Initialize count tracking per problem
    problem_set = set(problem_ids)
    saved_counts = {p: 0 for p in problem_ids}
    dirs = {}
    for p in problem_ids:
        p_dir = os.path.join(output_base, f"codenet_{p}")
        os.makedirs(p_dir, exist_ok=True)
        if clear_existing:
            for old_f in os.listdir(p_dir):
                old_path = os.path.join(p_dir, old_f)
                if os.path.isfile(old_path):
                    os.remove(old_path)
        dirs[p] = p_dir

    print("=" * 60)
    print(f"FALSICODE: Streaming IBM Project CodeNet for {lang.capitalize()}")
    print(f"Target Problems: {', '.join(problem_ids)} ({count} submissions each, min lines: {min_lines})")
    print(f"Output Base Directory: {output_base}")
    print("=" * 60)

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            with tarfile.open(fileobj=resp, mode="r|gz") as tar:
                for member in tar:
                    if not member.isfile() or not member.name.endswith(ext):
                        continue

                    # Member name structure: Project_CodeNet_Java250/p02981/s879202859.java
                    parts = member.name.split('/')
                    if len(parts) < 3:
                        continue
                    prob = parts[1]

                    if prob in problem_set and saved_counts[prob] < count:
                        f = tar.extractfile(member)
                        if f:
                            content = f.read()
                            lines = len(content.splitlines())
                            if min_lines > 0 and lines < min_lines:
                                continue
                            fname = os.path.basename(member.name)
                            dest = os.path.join(dirs[prob], fname)
                            with open(dest, "wb") as out_f:
                                out_f.write(content)
                            saved_counts[prob] += 1
                            print(f"  [{prob}][{saved_counts[prob]}/{count}] Saved {fname} ({lines} lines)")

                        # If all problems have reached the desired count, terminate early
                        if all(saved_counts[p] >= count for p in problem_ids):
                            print("\nAll requested problems extracted successfully!")
                            break

        print("\n" + "=" * 60)
        print(f"[DONE] Completed {lang.capitalize()} extraction summary:")
        for p in problem_ids:
            print(f"  * codenet_{p}: {saved_counts[p]}/{count} files saved -> {dirs[p]}")
        print("=" * 60 + "\n")
    except Exception as e:
        print(f"\n[ERROR] An error occurred during extraction: {e}")


def extract_problem(language="python", problem_id="p02709", count=20, output_dir=None, min_lines=0):
    """Backward compatibility wrapper for single problem extraction."""
    extract_problems(language=language, problem_ids=[problem_id], count=count, min_lines=min_lines)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract Project CodeNet DSA submissions directly.")
    parser.add_argument("--lang", default="python", choices=["python", "java"], help="Language: python or java")
    parser.add_argument("--problem", default="p02709", help="Problem ID or comma-separated list of IDs (e.g. p02709,p02594,p02607)")
    parser.add_argument("--count", type=int, default=20, help="Number of submissions per problem (default: 20)")
    parser.add_argument("--min-lines", type=int, default=0, help="Minimum lines of code per file (default: 0)")
    parser.add_argument("--clear", action="store_true", help="Clear existing files in output directory")
    parser.add_argument("--output", default=None, help="Custom output directory")
    args = parser.parse_args()

    problem_list = [p.strip() for p in args.problem.split(",") if p.strip()]
    extract_problems(
        language=args.lang,
        problem_ids=problem_list,
        count=args.count,
        output_base=args.output,
        min_lines=args.min_lines,
        clear_existing=args.clear
    )

