import re
from pathlib import Path

root = Path(__file__).parent

for path in root.rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    original = text

    text = text.replace('<base target="_blank">\n', '')
    text = text.replace('<base target="_blank">', '')
    text = text.replace(
        "https://mymegacalculator.com/og-image.jpg",
        "https://mymegacalculator.com/images/og-home.jpg",
    )
    text = text.replace(
        "https://mymegacalculator.com/ar/index.html",
        "https://mymegacalculator.com/ar/",
    )
    text = text.replace(
        "https://mymegacalculator.com/index.html",
        "https://mymegacalculator.com/",
    )
    text = re.sub(
        r"https://mymegacalculator\.com/([a-z0-9\-/]+)\.html",
        r"https://mymegacalculator.com/\1",
        text,
    )

    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"updated: {path.relative_to(root)}")
