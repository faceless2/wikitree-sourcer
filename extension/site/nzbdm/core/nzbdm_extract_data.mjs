/*
MIT License

Copyright (c) 2020 Robert M Pavey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function extractData(document, url) {
  var result = {};

  if (url) {
    result.url = url;
  }
  result.success = false;

  let searchResultsDiv = document.querySelector("div.ke_search_results");
  if (!searchResultsDiv) {
    return result;
  }

  let headingRow = searchResultsDiv.querySelector("tr.Cell_Search_Heading");
  let resultRows = searchResultsDiv.querySelectorAll("tr[class^=Cell_Search_Field]");

  if (!headingRow || !resultRows.length) {
    return result;
  }

  // for now always use the first result
  let selectedResultRow = resultRows[0];

  let headingFields = headingRow.querySelectorAll("th");
  let resultFields = selectedResultRow.querySelectorAll("td");

  if (!headingFields.length || !resultFields.length) {
    return result;
  }

  result.recordData = {};

  for (let index = 0; index < headingFields.length; index++) {
    let headingNode = headingFields[index];
    let valueNode = resultFields[index];

    let heading = headingNode.textContent.trim();
    let value = valueNode.textContent.trim();

    if (heading) {
      result.recordData[heading] = value;
    }
  }

  result.success = true;

  //console.log(result);

  return result;
}

export { extractData };
