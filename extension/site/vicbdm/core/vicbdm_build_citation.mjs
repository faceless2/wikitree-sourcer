/*
MIT License

Copyright (c) 2024 Robert M Pavey

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

import { simpleBuildCitationWrapper } from "../../../base/core/citation_builder.mjs";
import { RT } from "../../../base/core/record_type.mjs";

function buildVicbdmUrl(ed, builder) {
  return "https://www.bdm.vic.gov.au/research-and-family-history/search-your-family-history";
}

function buildSourceTitle(ed, gd, builder) {
  builder.sourceTitle += "Victoria State Government, Registry of Births, Deaths and Marriages Victoria";
}

function buildSourceReference(ed, gd, builder) {
  let recordType = gd.recordType;
  builder.sourceReference = "";
  if (recordType == RT.Birth || recordType == RT.BirthRegistration) {
    builder.sourceReference += "Births";
  } else if (recordType == RT.Death || recordType == RT.DeathRegistration) {
    builder.sourceReference += "Deaths";
  } else if (recordType == RT.Marriage || recordType == RT.MarriageRegistration) {
    builder.sourceReference += "Marriages";
  }

  if (ed.recordData) {
    let registrationNumber = ed.recordData["Registration number"];
    if (registrationNumber) {
      builder.sourceReference += ", Registration number: " + registrationNumber;
    }
  }
}

function buildRecordLink(ed, gd, builder) {
  var vicbdmUrl = buildVicbdmUrl(ed, builder);

  let recordLink = "[" + vicbdmUrl + " Link to Search Page]";
  builder.recordLinkOrTemplate = recordLink;
}

function buildCoreCitation(ed, gd, builder) {
  buildSourceTitle(ed, gd, builder);
  buildSourceReference(ed, gd, builder);
  buildRecordLink(ed, gd, builder);
  builder.addStandardDataString(gd);
}

function buildCitation(input) {
  return simpleBuildCitationWrapper(input, buildCoreCitation);
}

export { buildCitation };