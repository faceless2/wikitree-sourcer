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

import { extractData } from "../../extension/site/psuk/core/psuk_extract_data.mjs";
import { generalizeData } from "../../extension/site/psuk/core/psuk_generalize_data.mjs";
import { buildCitation } from "../../extension/site/psuk/core/psuk_build_citation.mjs";

import { runExtractDataTests } from "../test_utils/test_extract_data_utils.mjs";
import { runGeneralizeDataTests } from "../test_utils/test_generalize_data_utils.mjs";
import { runBuildCitationTests } from "../test_utils/test_build_citation_utils.mjs";

const regressionData = [
  {
    caseName: "probate_image_1958_ralph_pavey_full",
    url: "https://probatesearch.service.gov.uk/search-results",
    optionVariants: [
      {
        variantName: "regeneralizeFull",
        newData: {
          lastName: "Pavey",
          forenames: "Ralph Edgar",
          residence: "14 New Oak Road, Finchley, London, N.2",
          status: "",
          deathDate: "8 Sep 1958",
          deathPlace: "Middlesex Hospital, London, W.1",
          entryType: "Administration",
          probateRegistry: "London",
          probateDate: "13 October 1958",
          grantedTo: "Elsie Sarah Pavey widow",
          effects: "477 7s. 4d.",
          page: "410",
        },
      },
    ],
  },
  {
    caseName: "probate_image_1958_ralph_pavey",
    url: "https://probatesearch.service.gov.uk/search-results",
  },
  {
    caseName: "search_results_1958_ralph_pavey",
    url: "https://probatesearch.service.gov.uk/search-results",
  },
];

async function runTests(testManager) {
  await runExtractDataTests("psuk", extractData, regressionData, testManager);

  await runGeneralizeDataTests("psuk", generalizeData, regressionData, testManager);

  const functions = { buildCitation: buildCitation };
  await runBuildCitationTests("psuk", functions, regressionData, testManager);
}

export { runTests };
