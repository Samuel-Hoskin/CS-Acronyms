

$(document).ready( function () {
    $('#table_id').DataTable({
      responsive: {
        details: false
      },

      "language": {
            "search": "_INPUT_",            // Removes the 'Search' field label
            "searchPlaceholder": "Search"   // Placeholder for the search box
        },
      columnDefs: [
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: 1 },
          { responsivePriority: 3, targets: 2 },
          { responsivePriority: 4, targets: 3 }
      ]
    });
} );
$(document).ready(function() {
  $('div.dataTables_filter input').addClass('govuk-input govuk-input--width-');
  $('div.dataTables_filter').addClass('govuk-form-group');
  $("div.dataTables_filter").removeClass("dataTables_filter");
  $("#table_id_filter").detach().appendTo('#searchBox');
  $("div.dataTables_length select").addClass("govuk-select");
  $('div.govuk-form-group input').attr("onblur", "gtag('event', 'search', {search_term: this.value});");

});