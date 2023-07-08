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

import { RC } from "../../../base/core/record_collections.mjs";
import { RT } from "../../../base/core/record_type.mjs";
import { Role } from "../../../base/core/record_type.mjs";
import { WTS_Date } from "../../../base/core/wts_date.mjs";

import { buildNarrative } from "../../../base/core/narrative_builder.mjs";

import { groupSourcesIntoFacts } from "./fs_group_into_facts.mjs";

function buildFsPlainCitations(result, ed, type, options) {
  if (result.sources.length == 0) {
    result.citationsString = "";
    result.citationsStringType = type;
    return;
  }

  sortSourcesUsingFsSortKeysAndFetchedRecords(result);

  let citationsString = "";

  for (let source of result.sources) {
    if (type == "inline") {
      if (citationsString) {
        citationsString += "\n";
      }
      citationsString += buildRefForPlainCitation(source, false, options);
      citationsString += "\n";
    } else {
      citationsString += "* ";
      citationsString += getTextForPlainCitation(source, "source", false, options);
      citationsString += "\n";
    }
  }

  result.citationsString = citationsString;
  result.citationsStringType = type;
  result.citationCount = result.sources.length;
}

function inferBestEventDateForCompare(gd) {
  let eventDate = "";
  if (gd) {
    eventDate = gd.inferEventDate();

    if (gd.recordType == RT.Census) {
      let collection = undefined;
      if (gd.collectionData && gd.collectionData.id) {
        collection = RC.findCollection(gd.sourceOfData, gd.collectionData.id);
      }

      if (collection && collection.dates && collection.dates.exactDate) {
        eventDate = collection.dates.exactDate;
      }
    }

    if (!eventDate) {
      if (gd.recordType == RT.Burial) {
        // The burial date will be after the death date, we are not currently considering
        // date qualifiers in sorting though
        if (!gd.role || gd.role == Role.Primary) {
          let deathDate = gd.inferDeathDate();
          if (deathDate) {
            eventDate = deathDate;
          }
        } else {
          if (gd.inferPrimaryPersonDeathDate()) {
            let deathDate = gd.inferPrimaryPersonDeathDate();
            if (deathDate) {
              eventDate = deathDate;
            }
          }
        }
      }
    }
  }

  return eventDate;
}

// this can be used both for sorthing sources and facts
function compareGdsAndSources(gdA, gdB, sourceA, sourceB) {
  let recordTypeSortPriority = {};
  recordTypeSortPriority[RT.Birth] = 1;
  recordTypeSortPriority[RT.Baptism] = 3;

  recordTypeSortPriority[RT.Census] = 50;

  recordTypeSortPriority[RT.Death] = 90;
  recordTypeSortPriority[RT.Burial] = 93;
  recordTypeSortPriority[RT.Will] = 94;
  recordTypeSortPriority[RT.Probate] = 95;

  function getEventPriority(source) {
    let priority = 50;
    if (source.generalizedData) {
      let rtPriority = recordTypeSortPriority[source.generalizedData.recordType];
      if (rtPriority) {
        priority = rtPriority;
      }
    }
    return priority;
  }

  let eventDateA = "";
  if (gdA) {
    eventDateA = inferBestEventDateForCompare(gdA);
  }
  let eventDateB = "";
  if (gdB) {
    eventDateB = inferBestEventDateForCompare(gdB);
  }

  if (!eventDateA) {
    eventDateA = sourceA.eventDate;
  }
  if (!eventDateB) {
    eventDateB = sourceB.eventDate;
  }

  if (!eventDateA) {
    eventDateA = sourceA.sortYear;
  }
  if (!eventDateB) {
    eventDateB = sourceB.sortYear;
  }

  if (eventDateA && eventDateB) {
    let result = WTS_Date.compareDateStrings(eventDateA, eventDateB);
    if (result == 0) {
      // dates are equal, sort by record type
      let priorityA = getEventPriority(sourceA);
      let priorityB = getEventPriority(sourceB);
      result = priorityA - priorityB;
    }
    return result;
  }

  // if one has a date and the other doesn't then the one with the date comes first
  if (eventDateA) {
    return -1;
  } else if (eventDateB) {
    return 1;
  }

  if (sourceA.sortKey && sourceB.sortKey) {
    if (sourceA.sortKey < sourceB.sortKey) {
      return -1;
    } else if (sourceA.sortKey > sourceB.sortKey) {
      return 1;
    }
    return 0;
  }

  if (sourceA.sortKey) {
    return -1;
  } else if (sourceB.sortKey) {
    return 1;
  }

  return 0;
}

function sortSourcesUsingFsSortKeysAndFetchedRecords(result) {
  function compareFunction(a, b) {
    return compareGdsAndSources(a.generalizedData, b.generalizedData, a, b);
  }

  // sort the sources
  result.sources.sort(compareFunction);
  //console.log("sortSourcesUsingFsSortKeysAndFetchedRecords: sorted sources:");
  //console.log(result.sources);
}

function sortFacts(result) {
  // It is very unlikely that sortFacts will change the order but it does seem
  // possible in rare merge cases
  //console.log("sortFacts");
  //console.log(result);

  /*
  let oldOrder = [];
  for (let fact of result.facts) {
    oldOrder.push(fact);
  }
  */

  function compareFunction(a, b) {
    return compareGdsAndSources(a.generalizedData, b.generalizedData, a.sources[0], b.sources[0]);
  }

  // sort the sources
  result.facts.sort(compareFunction);

  /*
  if (oldOrder.length != result.facts.length) {
    console.log("length changed");
  } else {
    for (let factIndex = 0; factIndex < result.facts.length; factIndex++) {
      if (oldOrder[factIndex] != result.facts[factIndex]) {
        console.log("fact order different at indes " + factIndex);
      }
    }
  }
  */
}

function buildNarrativeForPlainCitation(source, options) {
  let narrative = "";

  if (source.prefName) {
    narrative += source.prefName;
  } else {
    narrative += "This person";
  }
  narrative += " was in a record";
  if (source.eventDate) {
    // could get correct preposition here (see formatDateObj in narrative_builder)
    narrative += " in " + source.eventDate;
  } else if (source.sortYear) {
    narrative += " in " + source.sortYear;
  }
  narrative += ".";
  return narrative;
}

function getTextForPlainCitation(source, type, isSourcerStyle, options) {
  function cleanText(text) {
    if (text) {
      text = text.replace(/\<\/?i\>/gi, "''");

      if (type == "source") {
        text = text.replace(/ *\n */g, "<br/>");
        text = text.replace(/\s+/g, " ");
      } else {
        text = text.replace(/ *\n */g, "<br/>\n");
      }

      text = text.trim();

      text = text.replace(/,$/g, "");

      text = text.trim();
    } else {
      text = "";
    }
    return text;
  }

  function cleanTitle(text) {
    if (text) {
      // sometimes title has a newline after the person's name for no apparent reason
      let titleText = text.replace(/\n/g, " ");
      titleText = titleText.replace(/\s+/g, " ");
      text = cleanText(titleText);
    }
    return text;
  }

  function cleanCitation(text) {
    if (text) {
      let titleText = text.replace(/\n/g, " ");
      titleText = titleText.replace(/\s+/g, " ");
      text = cleanText(titleText);
    }
    return text;
  }

  function cleanNotes(text) {
    if (text) {
      text = cleanText(text);

      // crap that sometimes gets pasted in
      text = text.replace(/[,\s\n]+save\s+cancel/gi, "");
      text = text.replace(/\s+View\sblank\sform,?/gi, "");
      text = text.replace(/\s+Add\salternate\sinformation,?/gi, "");
      text = text.replace(/\s+Report\s+issue,?/gi, "");
      text = text.replace(/SAVE\s+PRINT\s+SHARE[,.\s]/gi, "");
      text = text.replace(/[\s\n]+VIEW[ ,]/gi, "");

      text = text.replace(/ +/g, " ");
      text = text.trim();
    } else {
      text = "";
    }

    return text;
  }

  function addSeparationWithinBody(nonNewlineSeparator) {
    if (citationText) {
      let addedSeparation = false;
      if (isSourcerStyle) {
        if (options.citation_general_addBreaksWithinBody) {
          citationText += "<br/>";
          addedSeparation = true;
        }

        if (type != "source" && options.citation_general_addNewlinesWithinBody) {
          citationText += "\n";
          addedSeparation = true;
        }
      }

      if (!addedSeparation) {
        citationText += nonNewlineSeparator;
      }
    }
  }

  let cleanTitleText = cleanTitle(source.title);
  let cleanCitationText = cleanCitation(source.citation);

  let includedTitle = false;
  let includedCitation = false;
  let includedNotes = false;

  let citationText = "";

  // Harry A Pavey in the 1871 England Census

  if (cleanTitleText.includes(" in the ")) {
    citationText += cleanCitationText;
    includedCitation = true;
  } else {
    citationText += cleanTitleText;
    includedTitle = true;

    if (!citationText.includes(cleanCitationText)) {
      addSeparationWithinBody(" ");
      citationText += cleanCitationText;
      includedCitation = true;
    }
  }

  // somtimes the citation is just the uri, in this case it is better to put the title first
  if (!citationText || citationText == source.uri) {
    if (!includedTitle) {
      citationText = cleanTitleText;
      includedTitle = true;
    }
  }

  // if there is no other text other than notes then put it before link
  if (!citationText && !cleanTitleText && !cleanCitationText) {
    citationText += cleanText(source.notes);
    includedNotes = true;
  }

  if (source.uri && !citationText.includes(source.uri)) {
    let tempUri = source.uri.replace(/^https?\:\/\/[^\/]+\//, "");
    if (!citationText.includes(tempUri)) {
      addSeparationWithinBody(" ");
      if (source.uriUpdatedDate) {
        citationText += "(" + source.uri + " : " + source.uriUpdatedDate + ")";
      } else {
        citationText += source.uri;
      }
    }
  }

  if (!includedTitle && !citationText.includes(cleanTitleText)) {
    addSeparationWithinBody(", ");
    citationText += cleanTitleText;
  }

  if (!includedCitation && !citationText.includes(cleanCitationText)) {
    addSeparationWithinBody(", ");
    citationText += cleanCitationText;
  }

  if (source.notes && !includedNotes && options.addMerge_fsAllCitations_includeNotes) {
    // some notes are an automatic comment like "Source created by RecordSeek.com"
    // Not useful to include that.
    if (!source.notes.startsWith("Source created by ")) {
      addSeparationWithinBody(", ");
      citationText += " " + cleanNotes(source.notes);
    }
  }

  return citationText;
}

function buildRefForPlainCitation(source, isSourcerStyle, options) {
  let refString = "<ref>";
  if (options.citation_general_addNewlinesWithinRefs) {
    refString += "\n";
  }
  refString += getTextForPlainCitation(source, "inline", isSourcerStyle, options);
  if (options.citation_general_addNewlinesWithinRefs) {
    refString += "\n";
  }
  refString += "</ref>";
  return refString;
}

function generateSourcerCitationsStringForFacts(result, type, options) {
  // this is only ever used for narrative or inline
  let citationsString = "";
  let citationCount = 0;

  for (let fact of result.facts) {
    if (fact.generalizedData) {
      if (citationsString) {
        citationsString += "\n";
      }
      if (fact.sources.length > 1) {
        if (type == "narrative") {
          // need a combined narrative
          const narrativeInput = {
            eventGeneralizedData: fact.generalizedData,
            options: options,
          };
          let narrative = buildNarrative(narrativeInput);
          citationsString += narrative;
        }
        let longestTable = "";
        for (let source of fact.sources) {
          let citation = source.citationObject.citation;
          // strip off any existing narrative
          let refIndex = citation.indexOf("<ref>");
          if (refIndex != -1) {
            citation = citation.substring(refIndex);
          }
          // strip off any table after the narrative
          const endRef = "</ref>";
          let endRefIndex = citation.indexOf(endRef);
          if (endRefIndex != -1) {
            let startTableIndex = endRefIndex + endRef.length;
            if (startTableIndex < citation.length) {
              let table = citation.substring(startTableIndex);
              if (table.length > longestTable.length) {
                longestTable = table;
              }
              citation = citation.substring(0, startTableIndex);
            }
          }
          citationsString += citation;
        }
        if (longestTable) {
          citationsString += longestTable;
        }
      } else {
        for (let source of fact.sources) {
          citationsString += source.citationObject.citation;
        }
      }
      citationCount += fact.sources.length;
      citationsString += "\n";
    } else if (fact.sources.length == 1) {
      let source = fact.sources[0];

      if (citationsString) {
        citationsString += "\n";
      }

      if (type == "narrative") {
        citationsString += buildNarrativeForPlainCitation(source, options);
      }
      citationsString += buildRefForPlainCitation(source, true, options);

      citationsString += "\n";
      citationCount++;
    }
  }

  result.citationsString = citationsString;
  result.citationCount = citationCount;
}

function generateSourcerCitationsStringForTypeSource(result, options) {
  let citationsString = "";

  for (let source of result.sources) {
    if (source.citationObject) {
      citationsString += source.citationObject.citation;
      citationsString += "\n";
    } else {
      citationsString += "* " + getTextForPlainCitation(source, "source", true, options);
      citationsString += "\n";
    }
  }

  result.citationsString = citationsString;
  result.citationCount = result.sources.length;
}

function generateSourcerCitationsStringForTypeInline(result, options) {
  let citationsString = "";

  for (let source of result.sources) {
    if (source.citationObject) {
      if (citationsString) {
        citationsString += "\n";
      }
      citationsString += source.citationObject.citation;
      citationsString += "\n";
    } else {
      if (citationsString) {
        citationsString += "\n";
      }

      citationsString += buildRefForPlainCitation(source, true, options);
      citationsString += "\n";
    }
  }

  result.citationsString = citationsString;
  result.citationCount = result.sources.length;
}

function generateSourcerCitationsStringForTypeNarrative(result, options) {
  let citationsString = "";

  for (let source of result.sources) {
    if (source.citationObject) {
      if (citationsString) {
        citationsString += "\n";
      }
      citationsString += source.citationObject.citation;
      citationsString += "\n";
    } else {
      if (citationsString) {
        citationsString += "\n";
      }

      citationsString += buildNarrativeForPlainCitation(source, options);
      citationsString += buildRefForPlainCitation(source, true, options);
      citationsString += "\n";
    }
  }

  result.citationsString = citationsString;
  result.citationCount = result.sources.length;
}

async function buildSourcerCitations(result, type, options) {
  if (options.addMerge_fsAllCitations_excludeOtherRoleSources) {
    let newSources = [];
    for (let source of result.sources) {
      if (source.citationObject) {
        const gd = source.generalizedData;
        if (gd && gd.role && gd.role != Role.Primary) {
          // exclude this one
        } else {
          newSources.push(source);
        }
      } else {
        newSources.push(source);
      }
    }
    result.sources = newSources;
  }

  sortSourcesUsingFsSortKeysAndFetchedRecords(result);

  if (type == "source") {
    generateSourcerCitationsStringForTypeSource(result, options);
  } else {
    let groupCitations = options.addMerge_fsAllCitations_groupCitations;

    if (groupCitations) {
      groupSourcesIntoFacts(result, type, options); // only needed for inlne and narrative
      sortFacts(result);
      generateSourcerCitationsStringForFacts(result, type, options);
    } else {
      if (type == "inline") {
        generateSourcerCitationsStringForTypeInline(result, options);
      } else {
        // must be narrative
        generateSourcerCitationsStringForTypeNarrative(result, options);
      }
    }
  }

  result.citationsStringType = type;
}

export { buildSourcerCitations, buildFsPlainCitations };