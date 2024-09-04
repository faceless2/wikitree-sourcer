const earlyChurchCodes = {
  "AA": "Sydney, St Andrews, Bathurst Street",
  "AB": "Field of Mars",
  "AC": "Sydney, St James",
  "AD": "Co. Cumberland ('abodes' mostly Pennant Hills and Parramatta)",
  "AE": "Sydney, Macquarie Street",
  "AF": "Sydney, St Lawrence's",
  "AG": "Sydney (parish not stated)",
  "AH": "Parramatta",
  "AI": "Melbourne (VIC)",
  "AJ": "Sydney, St Phillip's",
  "CA": "Sydney, St Phillip's",
  "CB": "Parramatta, St John's",
  "CC": "Windsor, St Matthew's",
  "CD": "Castlereagh",
  "CE": "Richmond",
  "CF": "Liverpool, St Luke's",
  "CG": "Norfolk Island",
  "CH": "Hexham, Newcastle, Christ Church",
  "CI": "Campbelltown, St Peter's (Co. Aird)",
  "CJ": "Sydney, St James'",
  "CK": "Port Macquarie, St Thomas (Co. Ayr)",
  "CL": "Kelso",
  "CM": "Wilberforce",
  "CN": "Sackville Reach",
  "CO": "Moreton Bay (QLD)",
  "CP": "Sydney (parish not stated)",
  "CQ": "field of Mars, Marsfield, Ryde",
  "CR": "Cobbitty, Narellan",
  "CS": "Pitt Town",
  "CT": "Black Creek; Bulwarra; Cloden; East Maitland; Hinton; Hunter District; Maitland; Morpeth; West Maitland",
  "CU": "Brisbane, St John's (QLD)",
  "CV": "Berrima; Bong Bong; Sutton Forest; All Saints (Co. Camden)",
  "CW": "Abercrombie District, Bathurst",
  "CX": "Castle Hill; Dooral/Dural",
  "CY": "Lower Hawkesbury",
  "CZ": "Illawarra; Jervis Bay",
  "EA": "Sydney",
  "EB": "Port Macquarie",
  "EC": "Maitland; West Maitland",
  "ED": "Illawarra",
  "EE": "Windsor",
  "EF": "Bathurst",
  "EG": "Parramatta",
  "EH": "Shoalhaven",
  "EI": "Singleton",
  "EJ": "Bungonia; Goulburn",
  "EK": "Melbourne (VIC)",
  "EL": "Moreton Bay (QLD)",
  "EM": "Paterson; Scone",
  "EN": "Yass",
  "EO": "Tamworth",
  "EP": "Queanbeyan",
  "EQ": "Western NSW",
  "ER": "Richmond River District",
  "ES": "Albury",
  "ET": "Tumut",
  "EU": "Manning River District",
  "GA": "Ebenezer; Lake Macquarie",
  "GB": "Sydney, Pitt Street",
  "GC": "Melbourne, Collins Street (VIC)",
  "GD": "Parramatta",
  "GE": "Alexandria, South Head",
  "GF": "Sydney, St Phillip's Mariners' Church",
  "GG": "Petersham",
  "GH": "Maitland, West Maitland",
  "GI": "Sydney, St Lawrence's",
  "GJ": "Brisbane (QLD)",
  "GK": "Ipswich (QLD)",
  "GL": "Newcastle",
  "GM": "Saluafala, Island of Upolu, Samoa",
  "GN": "Sydney, St James'",
  "GO": "Wollongong",
  "IA": "Sydney",
  "IB": "Field of Mars, Parramatta",
  "IC": "Lower Hawkesbury",
  "ID": "Macdonald River",
  "IE": "Sackville Beach",
  "IF": "Portland Head",
  "IG": "Bathurst, Hill End",
  "IH": "Windsor",
  "II": "Mudgee",
  "IJ": "Wollongong",
  "IK": "Maitland; West Maitland",
  "IL": "Melbourne (VIC)",
  "IM": "Geelong (VIC)",
  "IN": "Camden",
  "IO": "Kempsey; Port Macquarie",
  "IP": "Hunter River District; Newcastle",
  "IQ": "Co. Argyle; Goulburn; Gunning; Yass",
  "IR": "Alexandria",
  "IS": "Brisbane; Co. Stanley; Ipswich; Moreton Bay (QLD)",
  "IT": "Queanbeyan",
  "IU": "Surry Hills",
  "IV": "Newtown",
  "IW": "Armidale, New England District",
  "IX": "Bowenfels",
  "IY": "Bega; Moruya",
  "IZ": "Albury",
  "JA": "Sydney, Scots Church",
  "JB": "Sydney, St Andrew's Scots Church",
  "JC": "Wollongong",
  "JD": "Wiseman's Ferry",
  "JE": "Balmain",
  "JF": "Newcastle",
  "JG": "Alexandria; Paddington",
  "JH": "Murrurundi; Scone",
  "JI": "Bathurst",
  "JJ": "Jervis Bay, Shoalhaven (Co. St Vincent)",
  "JK": "Sydney, St Stephen's (Macquarie Street)",
  "JL": "Hawkesbury District",
  "JM": "Pitt Town; Wilberforce",
  "JN": "Parramatta",
  "JO": "Windsor, St Matthew's",
  "JP": "Sydney, St Lawrence's",
  "JQ": "Sydney, St James'",
  "JR": "Butterwick; Hinton; Middlehope; Seaham",
  "JS": "Portland Head",
  "JT": "Port Macquarie, St Andrew's",
  "JU": "Cos. Of St Vincent, Murray and Auckland (Itinerant)",
  "JV": "Richmond",
  "JW": "Houghton",
  "JX": "Yass",
  "JY": "Bungonia; Goulburn",
  "JZ": "Co. Cook",
  "KA": "Sydney",
  "KB": "Maitland",
  "KC": "Houghton",
  "KD": "Newcastle",
  "KE": "Camden; Liverpool; Penrith; Narellan; Picton",
  "LA": "Sydney, St James'",
  "LB": "Adelaide (SA)",
  "LC": "Windsor, St Matthew's",
  "LD": "Sydney, St Mary's",
  "LE": "Campbelltown, St John's",
  "LF": "Yass",
  "LG": "Bathurst; Kelso; St Michael's, Co. Bathurst",
  "LH": "Parramatta, St Patrick's",
  "LI": "Liverpool",
  "LJ": "Mulgoa; Penrith",
  "LK": "East Maitland; Maitland; West Maitland",
  "LL": "Newcastle; Raymond Terrace",
  "LM": "Macdonald River, St Joseph's (Co. Hunter)",
  "LN": "Brisbane Water; East Gosford; Gosford; Kincumber",
  "LO": "Goulburn",
  "LP": "Berrima; Sutton Forest",
  "LQ": "Illawarra; Wollongong",
  "LR": "Melbourne, St Francis (VIC)",
  "LS": "Geelong (VIC)",
  "LT": "Hartley",
  "LU": "Moreton Bay (QLD); New England District",
  "LV": "Brisbane (QLD)",
  "LW": "Cooma; Monaro; Manaroo District; Queanbeyan; Twofold Bay",
  "LX": "Co. Cook",
  "LY": "Appin, St Bede's",
  "LZ": "Port Macquarie (Co. Macquarie)",
  "MA": "Australian Agricultural Company; Dungog; Eldon; Stroud; Uffington",
  "MB": "Port Stephens",
  "MC": "Bungonia; Goulburn; St Saviour's (Co. Argyle); Goulburn Plains; Lake Bathurst; Marulan",
  "MD": "Dapto; Wollongong",
  "ME": "Melbourne, St James' (VIC)",
  "MF": "Sydney, St Lawrence's",
  "MG": "Mulgoa, St Thomas",
  "MH": "Denham Court, St Mary's",
  "MI": "Gundaroo; Gunning; Yass",
  "MJ": "Canbury (Almost certainly Canberra); Lake George; Queanbeyan",
  "MK": "Brisbane Water",
  "ML": "Alnwick; Butterwick; Clarence Town; Middlehope; Raymond Terrace; Seaham",
  "MM": "Montefiores, Wellington District",
  "MN": "Cook's River; Petersham",
  "MO": "Inverary",
  "MP": "Lower Portland Head",
  "MQ": "Bringelly",
  "MR": "Oakville; Whittingham; Wollombi",
  "MS": "Sydney, Holy Trinity (Garrison Church)",
  "MT": "Mangrove Creek, Upper Mangrove",
  "MU": "Hunters Hill",
  "MV": "Macdonald and Colo River",
  "MW": "Penrith",
  "MX": "Appin",
  "MY": "Camden; St John's; Oaks; Picton; Stonequarry",
  "MZ": "Merriwa; Muswellbrook; Paterson",
  "NA": "Scone",
  "NB": "Monaro/Maneroo/Manaro",
  "NC": "Cydesdale, South Creek, St Mary Magdalene's",
  "ND": "Prospect, St Bartholomew's",
  "NE": "Aruleun, Braidwood",
  "NF": "Ashfield; Balmain; Burwood; Concord",
  "NG": "Belfast, Port Fairy, Portland (VIC)",
  "NH": "Binalong",
  "NI": "Clarence River District",
  "NJ": "Gulgong, Mudgee",
  "NK": "Albany, King George's Sound (WA)",
  "NL": "Sydney, St Andrew's",
  "NM": "Houghton",
  "NN": "Althorpe; Brougham; Invermain; Rowan",
  "NO": "Geelong (VIC)",
  "NP": "Gosford; Kincumber",
  "NQ": "Camberwell; Falbrook; Jerry's Plains; Warkworth; Wombo",
  "NR": "Carcoar",
  "NS": "Armidale, St Peter's",
  "NT": "Alexandria; Paddington",
  "NU": "Willoughby",
  "NV": "Camperdown; Newtown",
  "NW": "Jamberoo; Kiama; Shoalhaven",
  "NY": "Gordon",
  "NZ": "Canberra",
  "OA": "O'Connell Plains",
  "OB": "Ipswich (QLD)",
  "OC": "Liverpool Plains; Tamworth",
  "OD": "Warialda",
  "OE": "Gundagai",
  "OF": "Albury",
  "OG": "Wagga Wagga",
  "OH": "Greendale",
  "OI": "Enfield",
  "OJ": "Darling Downs; Drayton (QLD)",
  "OK": "Cooma",
  "OL": "Tumut",
  "OM": "Sofala",
  "ON": "Murrumbidgee District",
  "OO": "Pennant Hills",
  "OP": "Meroo; Tambaroora (Cos. Wellington and Roxburgh)",
  "OQ": "Pyrmont; St Bartholomew's",
  "OR": "Cassilis District (Co. Bligh), Merton",
  "OS": "Warwick (QLD)",
  "OT": "Burnett River, Wilde Bay (QLD)",
  "OU": "Redfern, St Paul's",
  "OV": "Darlinghurst, St John's",
  "OW": "Mount Vincent (Co. Northumberland)",
  "OX": "Dubbo",
  "OY": "Orange",
  "OZ": "Darling/Murray Junction (Wentworth)",
  "PA": "Campbelltown, St Peter's",
  "PB": "Upper Hunter",
  "PC": "Derbie; Hunter District; Maitland; Morpeth; Paterson; Singleton",
  "PD": "Kangaroo Point; Moreton Bay; Tambool (QLD)",
  "PE": "Armidale, New England",
  "PF": "Campbellfield, Melbourne (VIC)",
  "PG": "Illawarra District, Kiama",
  "PH": "Murrumbidgee and Murray District",
  "PI": "South Counties (itinerant), Liverpool Plains,",
  "PJ": "Vale of Clwydd (Rev Colin Stewart - Itinerant)",
  "PK": "Geelong (VIC)",
  "PL": "Gordon",
  "PM": "Portland (VIC)",
  "PN": "Whittingham",
  "PO": "Broulee",
  "PP": "Upper Hume River District",
  "PQ": "Will-Will-Rook (VIC)",
  "PR": "Brisbane (QLD)",
  "PS": "Field of Mars",
  "PT": "Sydney, St Phillip's",
  "PU": "Carcoar, Lachlan District",
  "PV": "Tumut",
  "PW": "Sutton Forest",
  "PX": "Wagga Wagga",
  "PY": "Sydney, German Reformed Church",
  "PZ": "Manning River District",
  "QA": "Clarence Town, Dungog, Stroud",
  "QB": "Cos. Of Durham and Gloucester",
  "QC": "Sydney, Scots Church (Pitt Street)",
  "QD": "Gayndah (QLD)",
  "QE": "Warwick (QLD)",
  "QF": "Sydney (parish not stated), Woolloomooloo",
  "QG": "Ipswich (QLD)",
  "QH": "Meroo, Tambaroora, Western Gold Fields (Co. Wellington)",
  "QI": "Braidwood, Bungendore",
  "QJ": "Bligh District",
  "QK": "Mudgee",
  "QL": "Terrys Meadows",
  "QM": "Albury",
  "QN": "Berrima",
  "RA": "Sydney, Pitt Street",
  "SA": "Hobart (TAS)",
  "SB": "Sydney",
  "TA": "Pitt Town",
  "TB": "Sydney",
  "TC": "Wollombi",
  "TD": "Liverpool",
  "TE": "Penrith",
  "TF": "New South Wales",
  "TG": "Maitland",
  "TH": "Mundamah",
  "TI": "Dural",
  "UA": "North Brisbane (QLD)",
  "VA": "Moreton Bay (QLD)",
  "VB": "Burragorang, St Paulinus'",
  "VC": "Singleton (inc. New England), St Augustine's, Co.Northumberland",
  "VD": "Port Macquarie and New England",
  "VE": "Carcoar; Cowra; Erroll; Orange",
  "VF": "Clarence River District, Co. Clarence",
  "VG": "Patrick's Plains",
  "VH": "Ipswich (QLD)",
  "VI": "Whittingham",
  "VJ": "Sofala",
  "VK": "Far South Coast, Co. Dampier",
  "VL": "Araluen; Braidwood",
  "VM": "Eldon",
  "VN": "Broulee, Moruya",
  "VO": "Kiama",
  "VP": "Armidale",
  "VQ": "Petersham, St Thomas'",
  "VR": "Wellington",
  "VS": "Balmain",
  "VT": "Albury (Co. Goulburn)",
  "VU": "Norfolk Island",
  "VV": "Sydney (Parish not stated)",
  "VW": "Picton",
  "VX": "Hawkesbury, Lower Hawkesbury",
  "VY": "Sydney, St Patrick's",
  "VZ": "Liverpool Plains",
  "XA": "Carcoar",
  "XB": "Blayney",
  "XC": "Ballina",
  "XD": "Balmain",
  "XE": "Liverpool Plains, inc. Gunnedah",
  "XF": "Glenorchy; Hobart; Port Arthur (TAS)",
  "XG": "New Zealand",
  "XH": "Macquarie Habour (TAS)",
  "XI": "Annandale; Ashfield; Burwood; Glebe",
  "XJ": "Hay, Moulamein District (Gospel Car Mission)",
  "XK": "Grafton",
  "XL": "Nymagee",
  "XM": "Ingalaboo (Tonga)",
  "XN": "Auburn",
  "XO": "Bombala Circuit",
  "XP": "Branxton",
  "XQ": "Brunswick",
  "XR": "Chippendale",
  "XS": "Cobargo; Tilba",
  "XT": "Cooma",
  "XU": "Glen Innes Circuit",
  "XV": "Leichhardt; Stanmore Circuit",
  "XW": "Macleay River",
  "XX": "Manning River Circuit",
  "XY": "Molong Circuit",
  "XZ": "Morpeth",
  "YA": "Canterbury",
  "YB": "Bega; Bombala; Eden",
  "YC": "Rockely River",
  "YD": "Tamworth Circuit",
  "YE": "Wagga Wagga",
  "YF": "Orange",
  "YG": "Randwick"
};
