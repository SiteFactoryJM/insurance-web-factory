"""Compatibility command for the portable intake workbook generator."""
from pathlib import Path
import subprocess

if __name__ == "__main__":
    raise SystemExit(subprocess.call(["node", str(Path(__file__).with_suffix(".mjs"))]))
