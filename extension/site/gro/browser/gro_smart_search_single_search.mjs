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

import { GroUriBuilder } from "../core/gro_uri_builder.mjs";
import { extractFirstRowForBirth, extractFirstRowForDeath, extractSecondRow } from "../core/gro_extract_data.mjs";

// Avoid creating this for every search
var domParser = new DOMParser();

function extractAllRowsData(document, firstRowFunction, secondRowFunction, result) {
  //console.log("extractAllRowsData called");

  let resultsNode = document.querySelector("[name='Results']");
  if (!resultsNode) {
    console.log("extractAllRowsData: no results found in document");
    return;
  }

  let resultsTable = resultsNode.closest("TABLE");
  if (!resultsTable) {
    console.log("extractAllRowsData: no results table found in document");
    return;
  }

  // look for the selected result
  let inputElements = resultsTable.querySelectorAll("input[type=radio]");

  // if no results bail out
  if (inputElements.length == 0) {
    //console.log("extractAllRowsData: no result rows found in document");
    return;
  }

  result.rows = [];

  for (let inputElement of inputElements) {
    let rowResult = {};
    firstRowFunction(inputElement, rowResult);
    secondRowFunction(inputElement, rowResult);

    result.rows.push(rowResult);
  }

  // Look to see how many pages there are
  result.resultsNumRecords = 0;
  result.resultsPageCount = 1;
  result.resultsPageNumber = 1;

  let possiblePageXOfYTdElements = resultsTable.querySelectorAll(
    "tbody > tr > td.main_text > table > tbody > tr > td.main_text"
  );
  //console.log("possiblePageXOfYTdElements.length is: " + possiblePageXOfYTdElements.length);

  for (let possiblePageXOfYTdElement of possiblePageXOfYTdElements) {
    let text = possiblePageXOfYTdElement.textContent;
    //console.log("possiblePageXOfYTdElement, text is: " + text);
    // example text : `250 Record(s) Found - Showing Page 1 of 5Go to page      `
    let regex = /(^\d+)\s+Record(?:\(s\))?\s+Found\s+-\s+Showing\s+Page\s+(\d+)\s+of\s+(\d+).*$/i;
    if (regex.test(text)) {
      result.resultsNumRecords = Number(text.replace(regex, "$1"));
      result.resultsPageNumber = Number(text.replace(regex, "$2"));
      result.resultsPageCount = Number(text.replace(regex, "$3"));
      //console.log("Found page number, resultsNumRecords is: " + result.resultsNumRecords);
      //console.log("Found page number, resultsPageNumber is: " + result.resultsPageNumber);
      //console.log("Found page number, resultsPageCount is: " + result.resultsPageCount);
      break;
    }
  }

  result.success = true;
}

function extractAllGroRowData(document) {
  var result = {
    success: false,
  };

  // first check whether these are births or deaths
  const isBirth = document.querySelector("#EW_Birth:checked");
  const isDeath = document.querySelector("#EW_Death:checked");

  if (isBirth) {
    extractAllRowsData(document, extractFirstRowForBirth, extractSecondRow, result);
  } else if (isDeath) {
    extractAllRowsData(document, extractFirstRowForDeath, extractSecondRow, result);
  }

  result.success = true;

  //console.log(result);

  return result;
}

async function doSearchPost(url, postData) {
  //console.log('doFetch, document.location is: ' + document.location);

  let fetchUrl = url;

  //console.log("doFetch, fetchUrl is: " + fetchUrl);

  let fetchOptionsHeaders = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let fetchOptions = {
    headers: fetchOptionsHeaders,
    body: postData,
    method: "POST",
  };

  try {
    let response = await fetch(fetchUrl, fetchOptions);

    //console.log("doFetch, response.status is: " + response.status);

    if (response.status !== 200) {
      //console.log("Looks like there was a problem. Status Code: " + response.status);
      //console.log("Fetch URL is: " + fetchUrl);
      return {
        success: false,
        errorCondition: "FetchError",
        status: response.status,
      };
    }

    let htmlText = await response.text();

    //console.log("doFetch: response text is:");
    //console.log(htmlText);

    let doc = domParser.parseFromString(htmlText, "text/html");

    return {
      success: true,
      status: response.status,
      document: doc,
    };
  } catch (error) {
    console.log("fetch failed, error is:");
    console.log(c);
    console.log("Fetch URL is: " + fetchUrl);

    return {
      success: false,
      errorCondition: "Exception",
      status: response.status,
      error: error,
    };
  }
}

async function doSingleSearch(singleSearchParameters, pageNumber) {
  let builder = new GroUriBuilder(true);

  const type = singleSearchParameters.type;
  const surname = singleSearchParameters.surname;
  const surnameMatches = singleSearchParameters.surnameMatches;
  const forename1 = singleSearchParameters.forename1;
  const forenameMatches = singleSearchParameters.forenameMatches;
  const forename2 = singleSearchParameters.forename2;
  const mmn = singleSearchParameters.mmn;
  const mmnMatches = singleSearchParameters.mmnMatches;
  const year = singleSearchParameters.year;
  const yearRange = singleSearchParameters.yearRange;
  const age = singleSearchParameters.age;
  const ageRange = singleSearchParameters.ageRange;
  const gender = singleSearchParameters.gender;
  const district = singleSearchParameters.district;

  //console.log("doSingleSearch, singleSearchParameters has:");
  //console.log("  year: " + year);
  //console.log("  yearRange: " + yearRange);
  if (age) {
    //console.log("  age: " + age);
    //console.log("  ageRange: " + ageRange);
  }

  // Add the parameters in the same order that the GRO page would add them
  if (type == "births") {
    builder.addIndex("EW_Birth");
  } else {
    builder.addIndex("EW_Death");
  }

  let currentPage = "1";
  if (pageNumber > 1) {
    currentPage = (pageNumber - 1).toString();
  }
  builder.addCurrentPage(currentPage);

  builder.addYear(year);
  builder.addYearRange(yearRange);

  builder.addSurname(surname);
  builder.addSurnameMatches(surnameMatches);
  builder.addFirstForename(forename1);
  builder.addForenameMatches(forenameMatches);
  builder.addSecondForename(forename2);
  builder.addUrlText("&Forename3=&Forename4=");

  if (gender == "male") {
    builder.addGenderMale();
  } else {
    builder.addGenderFemale();
  }

  if (type == "births") {
    builder.addMothersSurname(mmn);
    builder.addMothersSurnameMatches(mmnMatches);
  } else {
    builder.addAge(age);
    builder.addAgeRange(ageRange);
  }

  if (type == "births") {
    builder.addUrlText("&DOBDay=&DOBMonth=&DOBYear=&PlaceofBirth=");
  } else {
    builder.addUrlText("&DODDay=&DODMonth=&DODYear=&PlaceofDeath=");
  }

  builder.addDistrict(district);

  builder.addUrlText("&Quarter=&Month=&Volume=&Page=&Reg=&EntryNumber=&OccasionalCopy=&RUI=");

  if (pageNumber > 1) {
    builder.addUrlText("&SearchIndexes=" + pageNumber);
  } else {
    builder.addUrlText("&SearchIndexes=Search");
  }

  const url = builder.getUri();

  const searchUrl = "https://www.gro.gov.uk/gro/content/certificates/indexes_search.asp";

  let postData = "";
  const queryIndex = url.indexOf("?");
  if (queryIndex != -1) {
    let startOfQuery = queryIndex + 1;
    postData = url.substring(startOfQuery);
  }

  //console.log("postData is:");
  //console.log(postData);

  let fetchResult = await doSearchPost(searchUrl, postData);

  //console.log("fetchResult is:");
  //console.log(fetchResult);

  if (fetchResult.success && fetchResult.document) {
    // if user is not logged in we will have a successful fetch but
    // it will have been redirected to the login page
    if (fetchResult.document.title) {
      let lcTitle = fetchResult.document.title.toLowerCase();
      if (lcTitle.includes("login")) {
        await showErrorDialog(
          "Search failed. Please check that you are logged into the GRO site at https://www.gro.gov.uk/gro/content/certificates"
        );
        return { success: false };
      }
    }

    let extractResult = extractAllGroRowData(fetchResult.document);

    //console.log("extractResult is:");
    //console.log(extractResult);

    return extractResult;
  } else {
    await showErrorDialog("Search failed. Unable to get search results from GRO.");
  }

  return { success: false };
}

export { doSingleSearch };
