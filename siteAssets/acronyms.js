(function () {
  "use strict";

  var PAGE_SIZE = 25;
  var SEARCH_TRACK_DELAY = 800;
  var COL_ACRONYM = 0, COL_DEPT = 3;

  var rows = JSON.parse(document.getElementById("acronym-data").textContent);

  var searchEl = document.getElementById("search");
  var deptEl = document.getElementById("department");
  var clearEl = document.getElementById("clear");
  var summaryEl = document.getElementById("summary");
  var bodyEl = document.getElementById("results");
  var navEl = document.getElementById("pagination");

  var state = { q: "", dept: "", page: 1 };
  var lastTracked = "";
  var trackTimer = null;
  var results = [];

  function track(name, data) {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, data);
    }
  }

  function unique(values) {
    return Array.from(new Set(values)).filter(Boolean).sort(function (a, b) {
      return a.localeCompare(b, "en", { sensitivity: "base" });
    });
  }

  function fillSelect(select, values, selected) {
    var first = select.options[0];
    select.textContent = "";
    select.appendChild(first);
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
    select.value = values.indexOf(selected) === -1 ? "" : selected;
  }

  function filter() {
    var q = state.q.trim().toLowerCase();
    var matched = rows.filter(function (r) {
      return (!state.dept || r[COL_DEPT] === state.dept) &&
        (!q || r[COL_ACRONYM].toLowerCase().indexOf(q) !== -1);
    });
    if (q) {
      // exact matches first, then prefix matches, then the rest (stable)
      var rank = function (r) {
        var a = r[COL_ACRONYM].toLowerCase();
        return a === q ? 0 : a.indexOf(q) === 0 ? 1 : 2;
      };
      matched = matched
        .map(function (r, i) { return { r: r, i: i, k: rank(r) }; })
        .sort(function (a, b) { return a.k - b.k || a.i - b.i; })
        .map(function (x) { return x.r; });
    }
    return matched;
  }

  function renderRows(pageRows) {
    var frag = document.createDocumentFragment();
    pageRows.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.className = "govuk-table__row";
      r.forEach(function (text, i) {
        var cell = document.createElement(i === 0 ? "th" : "td");
        cell.className = i === 0 ? "govuk-table__header" : "govuk-table__cell";
        if (i === 0) cell.scope = "row";
        cell.textContent = text;
        tr.appendChild(cell);
      });
      frag.appendChild(tr);
    });
    bodyEl.textContent = "";
    if (!pageRows.length) {
      var tr = document.createElement("tr");
      tr.className = "govuk-table__row";
      var td = document.createElement("td");
      td.className = "govuk-table__cell";
      td.colSpan = 5;
      td.textContent = "No acronyms found.";
      tr.appendChild(td);
      frag.appendChild(tr);
    }
    bodyEl.appendChild(frag);
  }

  function pageList(current, total) {
    // 1 … current-1 current current+1 … total
    var pages = [];
    for (var p = 1; p <= total; p++) {
      if (p === 1 || p === total || Math.abs(p - current) <= 1) pages.push(p);
      else if (pages[pages.length - 1] !== "…") pages.push("…");
    }
    return pages;
  }

  function pageButton(label, page, opts) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "acronym-pagination__item";
    b.textContent = label;
    if (opts && opts.current) {
      b.setAttribute("aria-current", "page");
      b.setAttribute("aria-label", "Page " + page + ", current page");
    } else if (opts && opts.aria) {
      b.setAttribute("aria-label", opts.aria);
    } else {
      b.setAttribute("aria-label", "Page " + page);
    }
    if (opts && opts.disabled) b.disabled = true;
    b.addEventListener("click", function () {
      state.page = page;
      render(false);
      document.getElementById("table_id").scrollIntoView({ block: "start" });
    });
    return b;
  }

  function renderPagination(total) {
    navEl.textContent = "";
    if (total <= 1) return;
    navEl.appendChild(pageButton("Previous", state.page - 1, { disabled: state.page === 1, aria: "Previous page" }));
    pageList(state.page, total).forEach(function (p) {
      if (p === "…") {
        var gap = document.createElement("span");
        gap.className = "acronym-pagination__gap";
        gap.textContent = "…";
        navEl.appendChild(gap);
      } else {
        navEl.appendChild(pageButton(String(p), p, { current: p === state.page }));
      }
    });
    navEl.appendChild(pageButton("Next", state.page + 1, { disabled: state.page === total, aria: "Next page" }));
  }

  function syncUrl() {
    var params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.dept) params.set("dept", state.dept);
    if (state.page > 1) params.set("page", state.page);
    var qs = params.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  function render(refilter) {
    if (refilter !== false) results = filter();
    var pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    state.page = Math.min(Math.max(1, state.page), pages);
    var start = (state.page - 1) * PAGE_SIZE;
    renderRows(results.slice(start, start + PAGE_SIZE));
    renderPagination(pages);
    summaryEl.textContent = results.length
      ? "Showing " + (start + 1) + "–" + Math.min(start + PAGE_SIZE, results.length) + " of " + results.length + " acronyms"
      : "No acronyms found";
    syncUrl();
  }

  function trackSearch() {
    clearTimeout(trackTimer);
    var term = state.q.trim().toLowerCase().slice(0, 100);
    if (term.length < 2 || term === lastTracked) return;
    lastTracked = term;
    track("search", { term: term, results: results.length });
    if (!results.length) track("search-no-results", { term: term });
  }

  searchEl.addEventListener("input", function () {
    state.q = searchEl.value;
    state.page = 1;
    render();
    clearTimeout(trackTimer);
    trackTimer = setTimeout(trackSearch, SEARCH_TRACK_DELAY);
  });
  searchEl.addEventListener("blur", trackSearch);
  searchEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") trackSearch();
  });

  deptEl.addEventListener("change", function () {
    state.dept = deptEl.value;
    state.page = 1;
    render();
    if (state.dept) track("filter", { type: "department", value: state.dept });
  });

  clearEl.addEventListener("click", function () {
    state = { q: "", dept: "", page: 1 };
    searchEl.value = "";
    deptEl.value = "";
    render();
  });

  // Initial state from the URL
  var params = new URLSearchParams(location.search);
  state.q = params.get("q") || "";
  state.dept = params.get("dept") || "";
  state.page = parseInt(params.get("page"), 10) || 1;
  searchEl.value = state.q;
  fillSelect(deptEl, unique(rows.map(function (r) { return r[COL_DEPT]; })), state.dept);
  state.dept = deptEl.value;
  lastTracked = state.q.trim().toLowerCase().slice(0, 100); // don't re-track a shared link
  render();
})();
