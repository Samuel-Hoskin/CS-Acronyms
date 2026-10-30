# CS-Acronyms

This project attempts to document all the acronyms used in and around the civil service in order to improve everyone's understanding in the workplace.


## Building

The site is static. `csv2html.py` pulls the acronym list from the published Google Sheet and renders `index.html.j2` into `index.html`, embedding the data as JSON. `siteAssets/acronyms.js` (vanilla JS, no dependencies) provides search, a Department filter and pagination in the browser.

```
pip install -r requirements.txt
python3 csv2html.py
python3 -m http.server   # then open http://localhost:8000
```

## Analytics

The page uses Umami. `acronyms.js` sends these custom events: `search` (`term`, `results`), `search-no-results` (`term`), and `filter` (`type`, `value`).
