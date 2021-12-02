import pandas as pd
import jinja2

url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSf5yPnrU5Z_iIP7L3op6deIm5PeTrsr7RYgc82oBxzh4ZPoIa-JhTNr4YKECQA_AxDM616oVPPjQbr/pub?output=csv"
data = pd.read_csv(url)
data = data.where(pd.notnull(data), "")

out = open("index.html", "w")

out.write(jinja2.Environment(
        loader=jinja2.FileSystemLoader('.')
    ).get_template("index.html.j2").render({'acronyms': data.to_dict('records')))
