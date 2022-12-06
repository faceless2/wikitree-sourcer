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

import { GeneralizedData, dateQualifiers, WtsName } from "../../../base/core/generalize_data_utils.mjs";
import { RT } from "../../../base/core/record_type.mjs";

const titleToRegion = [
  {
    code: "AMBPA",
    title: "Akaroa Mail and Banks Peninsula Advertiser",
    region: "Canterbury",
    startYear: 1877,
    endYear: 1939,
  },
  {
    code: "ALG",
    title: "Albertland Gazette",
    region: "Auckland",
    startYear: 1862,
    endYear: 1864,
  },
  {
    code: "AHCOG",
    title: "Alexandra Herald and Central Otago Gazette",
    region: "Otago",
    startYear: 1902,
    endYear: 1948,
  },
  {
    code: "AMW",
    title: "Anglo-Maori Warder",
    region: "National",
    startYear: 1848,
    endYear: 1848,
  },
  {
    code: "AONUPEP",
    title: "Aotearoa : he Nupepa ma nga Tangata Maori",
    region: "National",
    startYear: 1892,
    endYear: 1892,
  },
  {
    code: "AG",
    title: "Ashburton Guardian",
    region: "Canterbury",
    startYear: 1879,
    endYear: 1950,
  },
  {
    code: "ASHH",
    title: "Ashburton Herald",
    region: "Canterbury",
    startYear: 1878,
    endYear: 1880,
  },
  {
    code: "ACNZC",
    title: "Auckland Chronicle and New Zealand Colonist",
    region: "Auckland",
    startYear: 1842,
    endYear: 1845,
  },
  {
    code: "AS",
    title: "Auckland Star",
    region: "Auckland",
    startYear: 1870,
    endYear: 1945,
  },
  {
    code: "AKTIM",
    title: "Auckland Times",
    region: "Auckland",
    startYear: 1842,
    endYear: 1846,
  },
  {
    code: "BPB",
    title: "Bay of Plenty Beacon",
    region: "Bay of Plenty",
    startYear: 1939,
    endYear: 1950,
  },
  {
    code: "BOPT",
    title: "Bay of Plenty Times",
    region: "Bay of Plenty",
    startYear: 1872,
    endYear: 1949,
  },
  {
    code: "BRATS",
    title: "Bratska Sloga",
    region: "Auckland",
    startYear: 1899,
    endYear: 1899,
  },
  {
    code: "BH",
    title: "Bruce Herald",
    region: "Otago",
    startYear: 1865,
    endYear: 1920,
  },
  {
    code: "BA",
    title: "Bush Advocate",
    region: "Hawke's Bay",
    startYear: 1888,
    endYear: 1912,
  },
  {
    code: "CHARG",
    title: "Charleston Argus",
    region: "West Coast",
    startYear: 1867,
    endYear: 1867,
  },
  {
    code: "CL",
    title: "Clutha Leader",
    region: "Otago",
    startYear: 1874,
    endYear: 1920,
  },
  {
    code: "TC",
    title: "Colonist",
    region: "Nelson-Tasman",
    startYear: 1857,
    endYear: 1920,
  },
  {
    code: "CROMARG",
    title: "Cromwell Argus",
    region: "Otago",
    startYear: 1869,
    endYear: 1948,
  },
  {
    code: "DSC",
    title: "Daily Southern Cross",
    region: "Auckland",
    startYear: 1843,
    endYear: 1876,
  },
  {
    code: "DTN",
    title: "Daily Telegraph",
    region: "Hawke's Bay",
    startYear: 1881,
    endYear: 1901,
  },
  {
    code: "DOM",
    title: "Dominion",
    region: "Wellington",
    startYear: 1907,
    endYear: 1934,
  },
  {
    code: "DUNST",
    title: "Dunstan Times",
    region: "Otago",
    startYear: 1866,
    endYear: 1948,
  },
  {
    code: "EG",
    title: "Ellesmere Guardian",
    region: "Canterbury",
    startYear: 1891,
    endYear: 1945,
  },
  {
    code: "EP",
    title: "Evening Post",
    region: "Wellington",
    startYear: 1865,
    endYear: 1945,
  },
  {
    code: "ESD",
    title: "Evening Star",
    region: "Otago",
    startYear: 1865,
    endYear: 1947,
  },
  {
    code: "FS",
    title: "Feilding Star",
    region: "Manawatu-Wanganui",
    startYear: 1879,
    endYear: 1934,
  },
  {
    code: "FRTIM",
    title: "Franklin Times",
    region: "Auckland",
    startYear: 1921,
    endYear: 1945,
  },
  {
    code: "NZFL",
    title: "Free Lance",
    region: "Wellington",
    startYear: 1900,
    endYear: 1920,
  },
  {
    code: "GISH",
    title: "Gisborne Herald",
    region: "Gisborne",
    startYear: 1939,
    endYear: 1950,
  },
  {
    code: "GSCCG",
    title: "Gisborne Standard and Cook County Gazette",
    region: "Gisborne",
    startYear: 1887,
    endYear: 1891,
  },
  {
    code: "GIST",
    title: "Gisborne Times",
    region: "Gisborne",
    startYear: 1901,
    endYear: 1937,
  },
  {
    code: "GLOBE",
    title: "Globe",
    region: "Canterbury",
    startYear: 1874,
    endYear: 1882,
  },
  {
    code: "GBARG",
    title: "Golden Bay Argus",
    region: "Nelson-Tasman",
    startYear: 1883,
    endYear: 1911,
  },
  {
    code: "GRA",
    title: "Grey River Argus",
    region: "West Coast",
    startYear: 1866,
    endYear: 1935,
  },
  {
    code: "GEST",
    title: "Greymouth Evening Star",
    region: "West Coast",
    startYear: 1901,
    endYear: 1920,
  },
  {
    code: "HAEATA",
    title: "Haeata",
    region: "National",
    startYear: 1859,
    endYear: 1862,
  },
  {
    code: "HAST",
    title: "Hastings Standard",
    region: "Hawke's Bay",
    startYear: 1896,
    endYear: 1910,
  },
  {
    code: "HNS",
    title: "Hawera &amp; Normanby Star",
    region: "Taranaki",
    startYear: 1880,
    endYear: 1924,
  },
  {
    code: "HAWST",
    title: "Hawera Star",
    region: "Taranaki",
    startYear: 1924,
    endYear: 1935,
  },
  {
    code: "HBH",
    title: "Hawke's Bay Herald",
    region: "Hawke's Bay",
    startYear: 1857,
    endYear: 1904,
  },
  {
    code: "HBT",
    title: "Hawke's Bay Times",
    region: "Hawke's Bay",
    startYear: 1861,
    endYear: 1874,
  },
  {
    code: "HBTRIB",
    title: "Hawke's Bay Tribune",
    region: "Hawke's Bay",
    startYear: 1910,
    endYear: 1936,
  },
  {
    code: "HBWT",
    title: "Hawke's Bay Weekly Times",
    region: "Hawke's Bay",
    startYear: 1867,
    endYear: 1868,
  },
  {
    code: "HIIR",
    title: "Hiiringa i te Whitu",
    region: "National",
    startYear: 1896,
    endYear: 1896,
  },
  {
    code: "HOKIOI",
    title: "Hokioi o Nui-Tireni, e rere atuna",
    region: "National",
    startYear: 1862,
    endYear: 1863,
  },
  {
    code: "HOG",
    title: "Hokitika Guardian",
    region: "West Coast",
    startYear: 1917,
    endYear: 1940,
  },
  {
    code: "HC",
    title: "Horowhenua Chronicle",
    region: "Manawatu-Wanganui",
    startYear: 1910,
    endYear: 1939,
  },
  {
    code: "HLC",
    title: "Hot Lakes Chronicle",
    region: "Bay of Plenty",
    startYear: 1895,
    endYear: 1910,
  },
  {
    code: "HUIA",
    title: "Huia Tangata Kotahi",
    region: "National",
    startYear: 1893,
    endYear: 1895,
  },
  {
    code: "HPDG",
    title: "Huntly Press and District Gazette",
    region: "Waikato",
    startYear: 1912,
    endYear: 1932,
  },
  {
    code: "HN",
    title: "Hutt News",
    region: "Wellington",
    startYear: 1927,
    endYear: 1948,
  },
  {
    code: "HVI",
    title: "Hutt Valley Independent",
    region: "Wellington",
    startYear: 1911,
    endYear: 1919,
  },
  {
    code: "IT",
    title: "Inangahua Times",
    region: "West Coast",
    startYear: 1877,
    endYear: 1942,
  },
  {
    code: "INDU",
    title: "Industrial Unionist",
    region: "National",
    startYear: 1913,
    endYear: 1913,
  },
  {
    code: "JUBIL",
    title: "Jubilee : Te Tiupiri",
    region: "National",
    startYear: 1898,
    endYear: 1900,
  },
  {
    code: "KAIST",
    title: "Kaikoura Star",
    region: "Canterbury",
    startYear: 1880,
    endYear: 1950,
  },
  {
    code: "KWE",
    title: "Kaipara and Waitemata Echo",
    region: "Auckland",
    startYear: 1911,
    endYear: 1921,
  },
  {
    code: "KOP",
    title: "Karere o Poneke",
    region: "Wellington",
    startYear: 1857,
    endYear: 1858,
  },
  {
    code: "KSRA",
    title: "Kawhia Settler and Raglan Advertiser",
    region: "Waikato",
    startYear: 1905,
    endYear: 1933,
  },
  {
    code: "KCC",
    title: "King Country Chronicle",
    region: "Waikato",
    startYear: 1906,
    endYear: 1939,
  },
  {
    code: "KAHITI",
    title: "Ko te Kahiti Tuturu mo Aotearoa, me te Waipounamu",
    region: "National",
    startYear: 1894,
    endYear: 1896,
  },
  {
    code: "KORIM",
    title: "Korimako",
    region: "National",
    startYear: 1882,
    endYear: 1890,
  },
  {
    code: "KUMAT",
    title: "Kumara Times",
    region: "West Coast",
    startYear: 1877,
    endYear: 1896,
  },
  {
    code: "LCM",
    title: "Lake County Mail",
    region: "Otago",
    startYear: 1947,
    endYear: 1948,
  },
  {
    code: "LCP",
    title: "Lake County Press",
    region: "Otago",
    startYear: 1872,
    endYear: 1928,
  },
  {
    code: "LWM",
    title: "Lake Wakatip Mail",
    region: "Otago",
    startYear: 1863,
    endYear: 1947,
  },
  {
    code: "LTCBG",
    title: "Lyell Times and Central Buller Gazette",
    region: "West Coast",
    startYear: 1885,
    endYear: 1886,
  },
  {
    code: "LT",
    title: "Lyttelton Times",
    region: "Canterbury",
    startYear: 1851,
    endYear: 1920,
  },
  {
    code: "MH",
    title: "Manawatu Herald",
    region: "Manawatu-Wanganui",
    startYear: 1878,
    endYear: 1939,
  },
  {
    code: "MS",
    title: "Manawatu Standard",
    region: "Manawatu-Wanganui",
    startYear: 1881,
    endYear: 1945,
  },
  {
    code: "MT",
    title: "Manawatu Times",
    region: "Manawatu-Wanganui",
    startYear: 1877,
    endYear: 1945,
  },
  {
    code: "MMTKM",
    title: "Maori Messenger : Te Karere Maori",
    region: "National",
    startYear: 1842,
    endYear: 1863,
  },
  {
    code: "MW",
    title: "Maoriland Worker",
    region: "National",
    startYear: 1910,
    endYear: 1924,
  },
  {
    code: "MKURA",
    title: "Mareikura",
    region: "Wellington",
    startYear: 1911,
    endYear: 1913,
  },
  {
    code: "MDTIM",
    title: "Marlborough Daily Times",
    region: "Marlborough",
    startYear: 1880,
    endYear: 1888,
  },
  {
    code: "MEX",
    title: "Marlborough Express",
    region: "Marlborough",
    startYear: 1868,
    endYear: 1920,
  },
  {
    code: "MPRESS",
    title: "Marlborough Press",
    region: "Marlborough",
    startYear: 1860,
    endYear: 1886,
  },
  {
    code: "MATREC",
    title: "Matamata Record",
    region: "Waikato",
    startYear: 1918,
    endYear: 1939,
  },
  {
    code: "MATAR",
    title: "Matariki",
    region: "Gisborne",
    startYear: 1881,
    endYear: 1881,
  },
  {
    code: "ME",
    title: "Mataura Ensign",
    region: "Southland",
    startYear: 1883,
    endYear: 1920,
  },
  {
    code: "MATUH",
    title: "Matuhi",
    region: "Wellington",
    startYear: 1903,
    endYear: 1906,
  },
  {
    code: "MOST",
    title: "Motueka Star",
    region: "Nelson-Tasman",
    startYear: 1901,
    endYear: 1938,
  },
  {
    code: "MIC",
    title: "Mount Ida Chronicle",
    region: "Otago",
    startYear: 1869,
    endYear: 1926,
  },
  {
    code: "MTBM",
    title: "Mt Benger Mail",
    region: "Otago",
    startYear: 1881,
    endYear: 1941,
  },
  {
    code: "NEM",
    title: "Nelson Evening Mail",
    region: "Nelson-Tasman",
    startYear: 1866,
    endYear: 1945,
  },
  {
    code: "NENZC",
    title: "Nelson Examiner and New Zealand Chronicle",
    region: "Nelson-Tasman",
    startYear: 1842,
    endYear: 1874,
  },
  {
    code: "NZABIG",
    title: "New Zealand Advertiser and Bay of Islands Gazette",
    region: "Northland",
    startYear: 1840,
    endYear: 1840,
  },
  {
    code: "NZCPNA",
    title: "New Zealand Colonist and Port Nicholson Advertiser",
    region: "Wellington",
    startYear: 1842,
    endYear: 1843,
  },
  {
    code: "NZGWS",
    title: "New Zealand Gazette and Wellington Spectator",
    region: "Wellington",
    startYear: 1839,
    endYear: 1844,
  },
  {
    code: "NZH",
    title: "New Zealand Herald",
    region: "Auckland",
    startYear: 1863,
    endYear: 1945,
  },
  {
    code: "NZHAG",
    title: "New Zealand Herald and Auckland Gazette",
    region: "Auckland",
    startYear: 1841,
    endYear: 1842,
  },
  {
    code: "NZMAIL",
    title: "New Zealand Mail",
    region: "Wellington",
    startYear: 1871,
    endYear: 1907,
  },
  {
    code: "NZSCSG",
    title: "New Zealand Spectator and Cook's Strait Guardian",
    region: "Wellington",
    startYear: 1844,
    endYear: 1865,
  },
  {
    code: "NZTIM",
    title: "New Zealand Times",
    region: "Wellington",
    startYear: 1874,
    endYear: 1927,
  },
  {
    code: "NZ",
    title: "New Zealander",
    region: "Auckland",
    startYear: 1845,
    endYear: 1866,
  },
  {
    code: "NCGAZ",
    title: "North Canterbury Gazette",
    region: "Canterbury",
    startYear: 1932,
    endYear: 1939,
  },
  {
    code: "NOT",
    title: "North Otago Times",
    region: "Otago",
    startYear: 1864,
    endYear: 1918,
  },
  {
    code: "NA",
    title: "Northern Advocate",
    region: "Northland",
    startYear: 1887,
    endYear: 1949,
  },
  {
    code: "NORAG",
    title: "Northland Age",
    region: "Northland",
    startYear: 1904,
    endYear: 1950,
  },
  {
    code: "NZTR",
    title: "NZ Truth",
    region: "National",
    startYear: 1906,
    endYear: 1930,
  },
  {
    code: "OAM",
    title: "Oamaru Mail",
    region: "Otago",
    startYear: 1876,
    endYear: 1920,
  },
  {
    code: "TO",
    title: "Observer",
    region: "Auckland",
    startYear: 1880,
    endYear: 1920,
  },
  {
    code: "OG",
    title: "Ohinemuri Gazette",
    region: "Waikato",
    startYear: 1891,
    endYear: 1921,
  },
  {
    code: "OPNEWS",
    title: "Opotiki News",
    region: "Bay of Plenty",
    startYear: 1938,
    endYear: 1950,
  },
  {
    code: "OPUNT",
    title: "Opunake Times",
    region: "Taranaki",
    startYear: 1894,
    endYear: 1949,
  },
  {
    code: "ODT",
    title: "Otago Daily Times",
    region: "Otago",
    startYear: 1861,
    endYear: 1950,
  },
  {
    code: "OW",
    title: "Otago Witness",
    region: "Otago",
    startYear: 1851,
    endYear: 1926,
  },
  {
    code: "OTMAIL",
    title: "Otaki Mail",
    region: "Wellington",
    startYear: 1919,
    endYear: 1943,
  },
  {
    code: "OSWCC",
    title: "Otautau Standard and Wallace County Chronicle",
    region: "Southland",
    startYear: 1905,
    endYear: 1932,
  },
  {
    code: "OO",
    title: "Oxford Observer",
    region: "Canterbury",
    startYear: 1889,
    endYear: 1901,
  },
  {
    code: "PAHH",
    title: "Pahiatua Herald",
    region: "Manawatu-Wanganui",
    startYear: 1893,
    endYear: 1943,
  },
  {
    code: "PSEA",
    title: "Pahiatua Star and Eketahuna Advertiser",
    region: "Manawatu-Wanganui",
    startYear: 1886,
    endYear: 1893,
  },
  {
    code: "PAKIOM",
    title: "Paki o Matariki",
    region: "Waikato",
    startYear: 1892,
    endYear: 1935,
  },
  {
    code: "PATM",
    title: "Patea Mail",
    region: "Taranaki",
    startYear: 1875,
    endYear: 1941,
  },
  {
    code: "PGAMA",
    title: "Pelorus Guardian and Miners' Advocate.",
    region: "Marlborough",
    startYear: 1890,
    endYear: 1919,
  },
  {
    code: "PIHOI",
    title: "Pihoihoi Mokemoke i Runga i te Tuanui",
    region: "National",
    startYear: 1863,
    endYear: 1863,
  },
  {
    code: "PBH",
    title: "Poverty Bay Herald",
    region: "Gisborne",
    startYear: 1879,
    endYear: 1939,
  },
  {
    code: "PBI",
    title: "Poverty Bay Independent",
    region: "Gisborne",
    startYear: 1885,
    endYear: 1886,
  },
  {
    code: "PBS",
    title: "Poverty Bay Standard",
    region: "Gisborne",
    startYear: 1872,
    endYear: 1884,
  },
  {
    code: "CHP",
    title: "Press",
    region: "Canterbury",
    startYear: 1861,
    endYear: 1979,
  },
  {
    code: "PUKEH",
    title: "Puke ki Hikurangi",
    region: "Wellington",
    startYear: 1897,
    endYear: 1913,
  },
  {
    code: "PWT",
    title: "Pukekohe &amp; Waiuku Times",
    region: "Auckland",
    startYear: 1912,
    endYear: 1921,
  },
  {
    code: "PUP",
    title: "Putaruru Press",
    region: "Waikato",
    startYear: 1923,
    endYear: 1950,
  },
  {
    code: "RAMA",
    title: "Rangitikei Advocate and Manawatu Argus",
    region: "Manawatu-Wanganui",
    startYear: 1907,
    endYear: 1920,
  },
  {
    code: "ROTWKG",
    title: "Rodney and Otamatea Times, Waitemata and Kaipara Gazette",
    region: "Auckland",
    startYear: 1901,
    endYear: 1945,
  },
  {
    code: "STSSA",
    title: "Samoa Times and South Sea Advertiser",
    region: "Samoa",
    startYear: 1888,
    endYear: 1896,
  },
  {
    code: "STSSG",
    title: "Samoa Times and South Sea Gazette",
    region: "Samoa",
    startYear: 1877,
    endYear: 1881,
  },
  {
    code: "SWH",
    title: "Samoa Weekly Herald",
    region: "Samoa",
    startYear: 1892,
    endYear: 1900,
  },
  {
    code: "SAMZ",
    title: "Samoanische Zeitung",
    region: "Samoa",
    startYear: 1903,
    endYear: 1930,
  },
  {
    code: "SATADV",
    title: "Saturday Advertiser",
    region: "National",
    startYear: 1875,
    endYear: 1878,
  },
  {
    code: "SNEWS",
    title: "Shannon News",
    region: "Manawatu-Wanganui",
    startYear: 1921,
    endYear: 1929,
  },
  {
    code: "SCANT",
    title: "South Canterbury Times",
    region: "Canterbury",
    startYear: 1879,
    endYear: 1901,
  },
  {
    code: "SOCR",
    title: "Southern Cross",
    region: "Southland",
    startYear: 1893,
    endYear: 1920,
  },
  {
    code: "ST",
    title: "Southland Times",
    region: "Southland",
    startYear: 1862,
    endYear: 1936,
  },
  {
    code: "TS",
    title: "Star (Christchurch)",
    region: "Canterbury",
    startYear: 1868,
    endYear: 1935,
  },
  {
    code: "STEP",
    title: "Stratford Evening Post",
    region: "Taranaki",
    startYear: 1911,
    endYear: 1936,
  },
  {
    code: "SUNAK",
    title: "Sun (Auckland)",
    region: "Auckland",
    startYear: 1927,
    endYear: 1930,
  },
  {
    code: "SUNCH",
    title: "Sun (Christchurch)",
    region: "Canterbury",
    startYear: 1914,
    endYear: 1920,
  },
  {
    code: "TAIDT",
    title: "Taihape Daily Times",
    region: "Manawatu-Wanganui",
    startYear: 1914,
    endYear: 1920,
  },
  {
    code: "TAKIT",
    title: "Takitimu",
    region: "Gisborne",
    startYear: 1883,
    endYear: 1883,
  },
  {
    code: "TCP",
    title: "Taranaki Central Press",
    region: "Taranaki",
    startYear: 1936,
    endYear: 1937,
  },
  {
    code: "TDN",
    title: "Taranaki Daily News",
    region: "Taranaki",
    startYear: 1900,
    endYear: 1935,
  },
  {
    code: "TH",
    title: "Taranaki Herald",
    region: "Taranaki",
    startYear: 1852,
    endYear: 1920,
  },
  {
    code: "TAN",
    title: "Te Aroha News",
    region: "Waikato",
    startYear: 1883,
    endYear: 1925,
  },
  {
    code: "TAWC",
    title: "Te Awamutu Courier",
    region: "Waikato",
    startYear: 1936,
    endYear: 1950,
  },
  {
    code: "TPT",
    title: "Te Puke Times",
    region: "Bay of Plenty",
    startYear: 1913,
    endYear: 1950,
  },
  {
    code: "TEML",
    title: "Temuka Leader",
    region: "Canterbury",
    startYear: 1878,
    endYear: 1932,
  },
  {
    code: "THA",
    title: "Thames Advertiser",
    region: "Waikato",
    startYear: 1874,
    endYear: 1899,
  },
  {
    code: "TGMR",
    title: "Thames Guardian and Mining Record",
    region: "Waikato",
    startYear: 1871,
    endYear: 1872,
  },
  {
    code: "THS",
    title: "Thames Star",
    region: "Waikato",
    startYear: 1874,
    endYear: 1938,
  },
  {
    code: "THD",
    title: "Timaru Herald",
    region: "Canterbury",
    startYear: 1864,
    endYear: 1945,
  },
  {
    code: "TT",
    title: "Tuapeka Times",
    region: "Otago",
    startYear: 1868,
    endYear: 1920,
  },
  {
    code: "UHWR",
    title: "Upper Hutt Weekly Review",
    region: "Wellington",
    startYear: 1935,
    endYear: 1939,
  },
  {
    code: "VT",
    title: "Victoria Times",
    region: "Wellington",
    startYear: 1841,
    endYear: 1841,
  },
  {
    code: "WHDT",
    title: "Waihi Daily Telegraph",
    region: "Waikato",
    startYear: 1904,
    endYear: 1951,
  },
  {
    code: "WAIGUS",
    title: "Waikato Argus",
    region: "Waikato",
    startYear: 1896,
    endYear: 1914,
  },
  {
    code: "WAIKIN",
    title: "Waikato Independent",
    region: "Waikato",
    startYear: 1904,
    endYear: 1949,
  },
  {
    code: "WT",
    title: "Waikato Times",
    region: "Waikato",
    startYear: 1872,
    endYear: 1945,
  },
  {
    code: "WDA",
    title: "Waimate Daily Advertiser",
    region: "Canterbury",
    startYear: 1898,
    endYear: 1929,
  },
  {
    code: "WAIPO",
    title: "Waipa Post",
    region: "Waikato",
    startYear: 1911,
    endYear: 1936,
  },
  {
    code: "WAIPM",
    title: "Waipawa Mail",
    region: "Hawke's Bay",
    startYear: 1878,
    endYear: 1940,
  },
  {
    code: "WAG",
    title: "Wairarapa Age",
    region: "Wellington",
    startYear: 1906,
    endYear: 1938,
  },
  {
    code: "WDT",
    title: "Wairarapa Daily Times",
    region: "Wellington",
    startYear: 1879,
    endYear: 1938,
  },
  {
    code: "WAIST",
    title: "Wairarapa Standard",
    region: "Wellington",
    startYear: 1867,
    endYear: 1887,
  },
  {
    code: "WAIBE",
    title: "Wairoa Bell",
    region: "Northland",
    startYear: 1892,
    endYear: 1919,
  },
  {
    code: "WAKAM",
    title: "Waka Maori",
    region: "National",
    startYear: 1863,
    endYear: 1884,
  },
  {
    code: "WANANG",
    title: "Wananga",
    region: "National",
    startYear: 1874,
    endYear: 1878,
  },
  {
    code: "WC",
    title: "Wanganui Chronicle",
    region: "Manawatu-Wanganui",
    startYear: 1860,
    endYear: 1950,
  },
  {
    code: "WH",
    title: "Wanganui Herald",
    region: "Manawatu-Wanganui",
    startYear: 1867,
    endYear: 1920,
  },
  {
    code: "WI",
    title: "Wellington Independent",
    region: "Wellington",
    startYear: 1845,
    endYear: 1874,
  },
  {
    code: "WCT",
    title: "West Coast Times",
    region: "West Coast",
    startYear: 1865,
    endYear: 1916,
  },
  {
    code: "WSTAR",
    title: "Western Star",
    region: "Southland",
    startYear: 1873,
    endYear: 1942,
  },
  {
    code: "WEST",
    title: "Westport Times",
    region: "West Coast",
    startYear: 1868,
    endYear: 1886,
  },
  {
    code: "WHETU",
    title: "Whetu o te Tau",
    region: "National",
    startYear: 1857,
    endYear: 1858,
  },
  {
    code: "WOODEX",
    title: "Woodville Examiner",
    region: "Manawatu-Wanganui",
    startYear: 1883,
    endYear: 1920,
  },
];

// This function generalizes the data extracted web page.
// We know what fields can be there. And we know the ones we want in generalizedData.
function generalizeData(input) {
  let data = input.extractedData;

  let result = new GeneralizedData();

  result.sourceOfData = "ppnz";

  if (!data.success == undefined) {
    return result; //the extract failed
  }

  result.sourceType = "record";

  const issue = data.issueDate;
  if (issue) {
    result.setEventDate(data.issueDate);
  }

  result.hasValidData = true;

  //console.log("ppnz; generalizeData: result is:");
  //console.log(result);

  return result;
}

export { generalizeData, GeneralizedData, dateQualifiers };