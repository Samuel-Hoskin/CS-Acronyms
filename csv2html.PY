import pandas as pd

url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSf5yPnrU5Z_iIP7L3op6deIm5PeTrsr7RYgc82oBxzh4ZPoIa-JhTNr4YKECQA_AxDM616oVPPjQbr/pub?output=csv"
data = pd.read_csv(url)
data = data.where(pd.notnull(data), "")
txt = open('data.txt', 'a')
txt.truncate(0)

for index, row in data.iterrows():

    a = row['Acronym']
    b = row['Definition']
    c = row['Meaning']
    d = row['Department']
    e = row['Team/Area']

    y = len(c) - 500
    if y > 0:
        c = c[:-y]


    first = '<tr class="govuk-table__row"><th scope="row" class="govuk-table__header">'
    second = '</th>'
    end = '<td class="govuk-table__cell">'
    end2 = '</td>'
    se = '],'

    x = first + a + second + end + str(b) + end2 + end + end2 + end + str(d) + end2 + end + str(e) + end2
#    x = first + a + second + end + b + end2 + end + end2 + end + d + end2 + end + e + end2
    txt.write(str(x) + '\n')