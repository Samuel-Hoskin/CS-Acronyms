import json
from datetime import datetime

import pandas as pd
import jinja2

url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSf5yPnrU5Z_iIP7L3op6deIm5PeTrsr7RYgc82oBxzh4ZPoIa-JhTNr4YKECQA_AxDM616oVPPjQbr/pub?output=csv"
data = pd.read_csv(url)
data = data.where(pd.notnull(data), "")


def truncate(text, length):
    text = str(text)
    return text if len(text) <= length else text[:length - 3].rstrip() + "..."


# One compact row per acronym, in table column order:
# [Acronym, Meaning, Definition, Department, Team/Area]
# (the sheet's "Definition" column is shown under the "Meaning" heading and vice versa)
rows = [
    [
        str(r["Acronym"]),
        str(r["Definition"]),
        truncate(r["Meaning"], 500),
        str(r["Department"]),
        str(r["Team/Area"]),
    ]
    for r in data.to_dict('records')
]

# Safe to embed inside a <script> block
acronyms_json = (
    json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    .replace("<", "\\u003c")
    .replace(" ", "\\u2028")
    .replace(" ", "\\u2029")
)

with open("index.html", "w", encoding="utf-8") as out:
    out.write(
        jinja2.Environment(
            loader=jinja2.FileSystemLoader('.'),
            autoescape=True
        ).get_template("index.html.j2").render({
            'date': datetime.utcnow(),
            'acronyms_json': acronyms_json
        }))
