import csv
import io
import urllib.request

url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSf5yPnrU5Z_iIP7L3op6deIm5PeTrsr7RYgc82oBxzh4ZPoIa-JhTNr4YKECQA_AxDM616oVPPjQbr/pub?output=csv"
webpage = urllib.request.urlopen(url)
datareader = csv.reader(io.TextIOWrapper(webpage))
data = list(datareader)
txt = open('data.txt', 'a')

for row in data:

    a = (row[0])
    b = (row[1])
    c = (row[2])
    d = (row[3])
    e = (row[4])

    y = len(c) - 500
    if y > 0:
        c = c[:-y]

    
    first = ('<tr class="govuk-table__row"><th scope="row" class="govuk-table__header">')
    second = ('</th>')
    end = ('<td class="govuk-table__cell">')
    end2 = ('</td>')
    se = ("],")

    x = first + a + second + end + b + end2 + end + end2 + end + d + end2 + end + e + end2
    txt.write(x + '\n')
