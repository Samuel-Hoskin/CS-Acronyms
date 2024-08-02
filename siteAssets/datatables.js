

$(document).ready(function () {
  let table = $('#table_id').DataTable({
    layout: {topEnd: null},
    responsive: {
      details: false
    },
    columnDefs: [
      { responsivePriority: 1, targets: 0 },
      { responsivePriority: 2, targets: 1 },
      { responsivePriority: 3, targets: 2 },
      { responsivePriority: 4, targets: 3 }
    ],
    initComplete: function () {
      $('#acronym-search').on('keyup', function () {
        // Search only the acronym column (index 0)
        table.column(0).search($(this).val(), { boundary: true }).draw();
      });
    }
  });


});
$(document).ready(function () {

  $("div.dataTables_length select").addClass("govuk-select");
  $('div.govuk-form-group input').attr("onblur", "gtag('event', 'search', {search_term: this.value})");
});