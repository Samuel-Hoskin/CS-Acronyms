/* global $ */

function searchClick() {
  let searchBox = document.getElementById('searchBox').value;
  searchBox = searchBox.toLowerCase();
  let aList = document.getElementsByClassName('govuk-table__row');

  for (i = 1; i < aList.length; i++) { 
    
    if (!aList[i].innerHTML.toLowerCase().includes(searchBox)) {
      aList[i].style.display="none";
    }
    else {
      aList[i].style.display="govuk-table__row";                 
    }
  }
}

