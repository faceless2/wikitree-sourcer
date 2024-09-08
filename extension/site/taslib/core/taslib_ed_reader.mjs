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

import { RT } from "../../../base/core/record_type.mjs";
import { ExtractedDataReader } from "../../../base/core/extracted_data_reader.mjs";
import { PlaceObj } from "../../../base/core/generalize_data_utils.mjs";

const eventTypes = [
  {
    taslibRecordType: "Arrivals",
    recordType: RT.PassengerList,
    eventDateKeys: ["Arrival date"],
  },
  {
    // either a birth registration or a baptism, the fields don't tell us because
    // baptism records in the index still have "Registered" for the place and "Registration year"
    // for the baptism place.
    // 1839 has birth regs and baptisms
    //  Baptism: https://libraries.tas.gov.au/Record/NamesIndex/1087028
    //  Birth Reg: https://libraries.tas.gov.au/Record/NamesIndex/992027
    // Earliest birth reg was Devember 1838.
    // Latest baptism
    // So if registration year is prior to Dec 1838 it is a Baptism.
    // Otherwise it could be a birth registration or baptism.

    taslibRecordType: "Births",
    endYear: 1839,
    recordType: RT.Baptism,
  },
  {
    taslibRecordType: "Births",
    startYear: 1838,
    recordType: RT.BirthOrBaptism,
  },
  {
    taslibRecordType: "Census",
    recordType: RT.Census,
    eventPlaceKeys: ["Census district"],
  },
  {
    taslibRecordType: "Colonial Secretary correspondence",
    recordType: RT.GovernmentDocument,
    eventDateKeys: ["Document date"],
  },
  {
    taslibRecordType: "Convicts",
    recordType: RT.ConvictTransportation,
    eventDateKeys: ["Arrival date", "Departure date"],
  },
  {
    taslibRecordType: "Deaths",
    hasFields: [["Date of burial"]],
    recordType: RT.Burial,
    eventDateKeys: ["Date of burial"],
  },
  {
    taslibRecordType: "Deaths",
    recordType: RT.Death,
    eventPlaceKeys: ["Where died"],
  },
  {
    taslibRecordType: "Departures",
    recordType: RT.PassengerList,
    eventDateKeys: ["Departure date"],
  },
  {
    taslibRecordType: "Divorces",
    recordType: RT.Divorce,
  },
  {
    taslibRecordType: "Immigration",
    recordType: RT.Immigration,
    eventDateKeys: ["Document date"],
  },
  {
    taslibRecordType: "Inquests",
    recordType: RT.Inquest,
    eventDateKeys: ["Date of inquest"],
  },
  {
    taslibRecordType: "Marriages",
    recordType: RT.Marriage,
    eventDateKeys: ["Date of marriage"],
    eventPlaceKeys: ["Where married"],
  },
  {
    taslibRecordType: "Wills",
    recordType: RT.Will,
  },
];

function findEventType(ed) {
  let yearString = ed.recordData["Registration year"];
  if (!yearString) {
    yearString = ed.recordData["Year"];
  }

  let yearNum = undefined;
  if (yearString && /^\d\d\d\d$/.test(yearString)) {
    yearNum = Number(yearString);
  }

  let taslibRecordType = ed.recordData["Record Type"];
  for (let eventType of eventTypes) {
    if (eventType.taslibRecordType == taslibRecordType) {
      if (eventType.endYear && yearNum && yearNum > eventType.endYear) {
        continue;
      }
      if (eventType.startYear && yearNum && yearNum < eventType.startYear) {
        continue;
      }
      if (eventType.hasFields) {
        let matched = false;
        for (let fieldSet of eventType.hasFields) {
          let fieldSetMatched = true;
          for (let field of fieldSet) {
            if (!ed.recordData[field]) {
              fieldSetMatched = false;
              break;
            }
          }
          if (fieldSetMatched) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          continue;
        }
      }

      // not excluded by conditions
      return eventType;
    }
  }
}

class TaslibEdReader extends ExtractedDataReader {
  constructor(ed) {
    super(ed);

    // See this page for information on the records in the names index:
    // https://libraries.tas.gov.au/tasmanian-archives/records-included-in-the-names-index/
    // This FamilySearch pages also has useful info:
    // https://www.familysearch.org/en/wiki/Tasmania_Civil_Registration

    if (ed.recordData) {
      this.eventType = findEventType(ed);
      if (this.eventType) {
        this.recordType = this.eventType.recordType;
      }
    }
  }

  getRecordDataValue(keys) {
    if (this.ed.recordData) {
      for (let key of keys) {
        let value = this.ed.recordData[key];
        if (value) {
          return value;
        }
      }
    }
  }

  makeDateObjFromTaslibDateString(dateString, isRegistrationDate) {
    let dateObj = this.makeDateObjFromDateString(dateString);

    if (dateObj && isRegistrationDate) {
      dateObj.isRegistrationDate = isRegistrationDate;
    }

    return dateObj;
  }

  makePlaceObjFromTaslibPlaceName(placeString, isRegistrationPlace) {
    // possibly separate out street address if present

    let placeObj = new PlaceObj();

    let fullPlaceString = placeString;

    if (fullPlaceString) {
      if (!fullPlaceString.includes("Tasmania") && !fullPlaceString.includes("Australia")) {
        fullPlaceString += ", Tasmania, Australia";
      }
    } else {
      fullPlaceString = "Tasmania, Australia";
    }

    placeObj.placeString = fullPlaceString;

    if (placeString) {
      placeObj.originalPlaceString = placeString;
    }

    if (isRegistrationPlace) {
      placeObj.isRegistrationPlace = true;
    }

    return placeObj;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Overrides of the relevant get functions used in commonGeneralizeData
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  hasValidData() {
    if (!this.ed.success) {
      return false; //the extract failed, GeneralizedData is not even normally called in this case
    }

    if (!this.ed.recordData) {
      return false;
    }

    if (!this.recordType) {
      return false;
    }

    return true;
  }

  getSourceType() {
    return "record";
  }

  getNameObj() {
    let name1 = this.ed.recordData["Name"];

    if (this.recordType == RT.Divorce) {
      //   "Name": "Grice, Clarence Vernon - Petitioner",
      //   "Name2": "Grice, Kathleen Elizabeth - Respondent",
      const petitionerSuffix = " - Petitioner";
      if (name1.endsWith(petitionerSuffix)) {
        name1 = name1.substring(0, name1.length - petitionerSuffix.length);
      }
    }

    let nameObj = this.makeNameObjFromLastNameCommaForenames(name1);
    if (nameObj && nameObj.forenames == "Given Name Not Recorded") {
      nameObj.forenames = "";
    }
    return nameObj;
  }

  getGender() {
    let gender = this.ed.recordData["Gender"];
    if (gender) {
      let lcGender = gender.toLowerCase();
      if (lcGender == "male") {
        return "male";
      } else if (lcGender == "female") {
        return "female";
      }
    }
    return "";
  }

  getEventDateObj() {
    // for some events there is a date that overrides the "Registration year" or "Year"
    // For baptism or BirthOrBaptism the even is the baptism or registration so birth date
    // is not used as event date. But for a marriage the marriage date is used as event date.
    let dateString = "";
    let isRegistrationDate = false;

    if (this.eventType && this.eventType.eventDateKeys) {
      dateString = this.getRecordDataValue(this.eventType.eventDateKeys);
    }

    if (!dateString) {
      dateString = this.ed.recordData["Registration year"];
      isRegistrationDate = true;
    }

    if (!dateString) {
      dateString = this.ed.recordData["Year"];
    }

    return this.makeDateObjFromTaslibDateString(dateString, isRegistrationDate);
  }

  getEventPlaceObj() {
    let placeString = this.ed.recordData["Registered"];
    let isRegistrationPlace = false;
    if (placeString) {
      isRegistrationPlace = true;
    }

    if (!placeString) {
      if (this.eventType && this.eventType.eventPlaceKeys) {
        placeString = this.getRecordDataValue(this.eventType.eventPlaceKeys);
      }
    }

    return this.makePlaceObjFromTaslibPlaceName(placeString, isRegistrationPlace);
  }

  getLastNameAtBirth() {
    if (this.recordType == RT.BirthOrBaptism || this.recordType == RT.Baptism) {
      let nameObj = this.getNameObj();
      if (nameObj && nameObj.lastName) {
        return nameObj.lastName;
      }
    }
    return "";
  }

  getLastNameAtDeath() {
    if (this.recordType == RT.Death || this.recordType == RT.Burial) {
      let nameObj = this.getNameObj();
      if (nameObj && nameObj.lastName) {
        return nameObj.lastName;
      }
    }
    return "";
  }

  getMothersMaidenName() {
    return "";
  }

  getBirthDateObj() {
    let dateString = this.ed.recordData["Date of birth"];
    return this.makeDateObjFromDateString(dateString);
  }

  getBirthPlaceObj() {
    let placeString = this.ed.recordData["Where born"];
    if (placeString) {
      return this.makePlaceObjFromTaslibPlaceName(placeString);
    }
  }

  getDeathDateObj() {
    let dateString = this.ed.recordData["Date of death"];
    return this.makeDateObjFromDateString(dateString);
  }

  getDeathPlaceObj() {
    let placeString = this.ed.recordData["Where died"];
    if (placeString) {
      return this.makePlaceObjFromTaslibPlaceName(placeString);
    }
  }

  getAgeAtEvent() {
    let age = this.ed.recordData["Age"];
    // age can be "Adult" or "Minor". Should we exclude these?
    return age;
  }

  getAgeAtDeath() {
    if (this.recordType == RT.Death) {
      return this.getAgeAtEvent();
    }

    return "";
  }

  getRegistrationDistrict() {
    return this.ed.recordData["Registered"];
  }

  getRelationshipToHead() {
    return "";
  }

  getMaritalStatus() {
    return "";
  }

  getOccupation() {
    return "";
  }

  getArrivalDate() {
    if (this.recordType == RT.PassengerList || this.recordType == RT.ConvictTransportation) {
      return this.ed.recordData["Arrival date"];
    }
    return "";
  }

  getArrivalPlace() {
    if (this.recordType == RT.PassengerList || this.recordType == RT.ConvictTransportation) {
      return this.ed.recordData["Bound to"];
    }
    return "";
  }

  getDepartureDate() {
    if (this.recordType == RT.PassengerList || this.recordType == RT.ConvictTransportation) {
      return this.ed.recordData["Departure date"];
    }

    return "";
  }

  getDeparturePlace() {
    if (this.recordType == RT.PassengerList || this.recordType == RT.ConvictTransportation) {
      return this.ed.recordData["Departure port"];
    }
    return "";
  }

  getShipName() {
    if (this.recordType == RT.PassengerList || this.recordType == RT.ConvictTransportation) {
      return this.ed.recordData["Ship"];
    }
    return "";
  }

  getSpouses() {
    if (this.recordType == RT.Marriage) {
      let spouseName = this.ed.recordData["Spouse"];
      if (spouseName) {
        let spouseNameObj = this.makeNameObjFromLastNameCommaForenames(spouseName);
        let spouseAge = this.ed.recordData["Age2"];
        let spouseGender = this.ed.recordData["Gender2"];

        let spouse = {
          name: spouseNameObj,
          gender: spouseGender,
          age: spouseAge,
        };

        let marriageDate = this.ed.recordData["Date of marriage"];
        if (marriageDate) {
          spouse.marriageDate = this.makeDateObjFromTaslibDateString(marriageDate);
        }

        let spouses = [spouse];
        return spouses;
      }
    } else if (this.recordType == RT.Divorce) {
      //   "Name": "Grice, Clarence Vernon - Petitioner",
      //   "Name2": "Grice, Kathleen Elizabeth - Respondent",

      let name2 = this.ed.recordData["Name2"];

      const responentSuffix = " - Respondent";
      if (name2 && name2.endsWith(responentSuffix)) {
        name2 = name2.substring(0, name2.length - responentSuffix.length);
      }
      let spouseNameObj = this.makeNameObjFromLastNameCommaForenames(name2);
      if (spouseNameObj) {
        let spouse = {
          name: spouseNameObj,
        };
        let spouses = [spouse];
        return spouses;
      }
    }
    return undefined;
  }

  getParents() {
    let fatherName = this.ed.recordData["Father"];
    let motherName = this.ed.recordData["Mother"];
    if (fatherName || motherName) {
      let parents = {};
      if (fatherName) {
        let fatherNameObj = this.makeNameObjFromLastNameCommaForenames(fatherName);
        parents.father = { name: fatherNameObj };
      }
      if (motherName) {
        let motherNameObj = this.makeNameObjFromLastNameCommaForenames(motherName);
        parents.mother = { name: motherNameObj };
      }
      return parents;
    }
    return undefined;
  }

  getHousehold() {
    return undefined;
  }

  getCollectionData() {
    return undefined;
  }
}

export { TaslibEdReader };
