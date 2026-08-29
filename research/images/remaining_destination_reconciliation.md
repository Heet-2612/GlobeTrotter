# GlobeTrotter — Remaining Destination Reconciliation Audit

> **Authoritative Source:** `final_165_destination_catalog.json` (165 Master Catalog Destinations)  
> **Old File Audited:** `destinations(1).txt` (165 Total Rows)  
> **Matching Methodology:** Semantic Identity (Name, Canonical Name, Aliases, State) — Obsolete Old Catalog Numbers Ignored  
> **Audit Status:** **`REMAINING_DESTINATION_AUDIT = PASS`**  
> **Generated At:** 2026-08-27T20:37:49.987Z  

---

## 1. Executive Summary & Counts

- **Total Authoritative Catalog Destinations:** **165**
- **Current Destinations Found in Old File:** **106**
- **Current Destinations NOT Found in Old File:** **57**
- **Old File Unique Destinations Total:** **146**
- **Old File Destinations NOT in Current Catalog (Extra):** **38**
- **Ambiguous Matches Identified:** **2**
- **Duplicate Destination Entries in Old File:** **19**

---

## 2. Regional Coverage Deep-Dive Audit

| Region / State | Catalog Total Destinations | Matched in Old File | Missing from Old File | Missing Destination Names |
| :--- | :---: | :---: | :---: | :--- |
| **Gujarat** | 10 | 0 | **10** | #49 Ahmedabad, #50 Rann of Kutch, #101 Dwarka, #102 Somnath, #103 Gir, #104 Statue of Unity, #105 Saputara, #110 Champaner-Pavagadh, #111 Dholavira, #112 Modhera-Patan |
| **Lakshadweep** | 1 | 0 | **1** | #76 Lakshadweep |
| **Rajasthan** | 13 | 11 | **2** | #130 Shekhawati, #131 Ranakpur |
| **Kerala** | 14 | 13 | **1** | #115 Kerala |
| **Karnataka** | 11 | 8 | **3** | #77 Chikkamagaluru, #79 Nagarhole, #81 Murudeshwar |
| **Tamil Nadu** | 17 | 11 | **6** | #83 Yercaud, #84 Valparai, #85 Chettinad, #156 Tirunelveli, #157 Velankanni, #158 Hogenakkal |
| **Madhya Pradesh** | 14 | 8 | **5** | #52 Ujjain, #91 Bhedaghat, #92 Kanha, #93 Bandhavgarh, #122 Omkareshwar |
| **Uttar Pradesh** | 8 | 6 | **1** | #133 Sarnath |
| **Himachal Pradesh** | 7 | 6 | **1** | #65 Kasauli |
| **Uttarakhand** | 10 | 7 | **3** | #136 Kedarnath, #137 Badrinath, #163 Kausani |

---

## 3. List 1: CURRENT_CATALOG_NOT_FOUND_IN_OLD_FILE (57 Destinations)

The following **57 destinations** belong to our authoritative 165-destination catalog but have **NO corresponding entry** in `destinations(1).txt`:

| Catalog # | Destination Name | State / Region |
| :---: | :--- | :--- |
| #12 | **Ladakh** | Ladakh |
| #26 | **Puducherry** | Puducherry |
| #39 | **Gangtok** | Sikkim |
| #49 | **Ahmedabad** | Gujarat |
| #50 | **Rann of Kutch** | Gujarat |
| #52 | **Ujjain** | Madhya Pradesh |
| #65 | **Kasauli** | Himachal Pradesh |
| #74 | **Ziro Valley** | Arunachal Pradesh |
| #75 | **Andaman Islands** | Andaman & Nicobar Islands |
| #76 | **Lakshadweep** | Lakshadweep |
| #77 | **Chikkamagaluru** | Karnataka |
| #79 | **Nagarhole** | Karnataka |
| #81 | **Murudeshwar** | Karnataka |
| #83 | **Yercaud** | Tamil Nadu |
| #84 | **Valparai** | Tamil Nadu |
| #85 | **Chettinad** | Tamil Nadu |
| #88 | **Tirupati** | Andhra Pradesh |
| #91 | **Bhedaghat** | Madhya Pradesh |
| #92 | **Kanha** | Madhya Pradesh |
| #93 | **Bandhavgarh** | Madhya Pradesh |
| #97 | **Chhatrapati Sambhajinagar** | Maharashtra |
| #99 | **Matheran** | Maharashtra |
| #100 | **Tarkarli** | Maharashtra |
| #101 | **Dwarka** | Gujarat |
| #102 | **Somnath** | Gujarat |
| #103 | **Gir** | Gujarat |
| #104 | **Statue of Unity** | Gujarat |
| #105 | **Saputara** | Gujarat |
| #106 | **Manas** | Assam |
| #107 | **Diu** | Dadra and Nagar Haveli and Daman and Diu |
| #110 | **Champaner-Pavagadh** | Gujarat |
| #111 | **Dholavira** | Gujarat |
| #112 | **Modhera-Patan** | Gujarat |
| #113 | **Vaishno Devi** | Jammu & Kashmir |
| #115 | **Kerala** | Kerala |
| #122 | **Omkareshwar** | Madhya Pradesh |
| #125 | **Bhimashankar** | Maharashtra |
| #126 | **Lonar** | Maharashtra |
| #127 | **Dawki** | Meghalaya |
| #128 | **Chilika Lake** | Odisha |
| #130 | **Shekhawati** | Rajasthan |
| #131 | **Ranakpur** | Rajasthan |
| #133 | **Sarnath** | Uttar Pradesh |
| #136 | **Kedarnath** | Uttarakhand |
| #137 | **Badrinath** | Uttarakhand |
| #141 | **Gaya** | Bihar |
| #143 | **Daringbadi** | Odisha |
| #144 | **Sambalpur** | Odisha |
| #145 | **Digha** | West Bengal |
| #146 | **Murshidabad** | West Bengal |
| #147 | **Shantiniketan** | West Bengal |
| #148 | **Bishnupur** | West Bengal |
| #156 | **Tirunelveli** | Tamil Nadu |
| #157 | **Velankanni** | Tamil Nadu |
| #158 | **Hogenakkal** | Tamil Nadu |
| #163 | **Kausani** | Uttarakhand |
| #164 | **Gandikota** | Andhra Pradesh |

---

## 4. List 2: OLD_FILE_EXTRA_DESTINATIONS (38 Unique Destinations)

The following **38 destinations** exist in `destinations(1).txt` but have **NO corresponding destination** in our authoritative 165 master catalog:

| Old File Destination | State | Old File Line / Number |
| :--- | :--- | :---: |
| **Alwar** | Rajasthan | #14 |
| **Bharatpur** | Rajasthan | #15 |
| **Kumbhalgarh** | Rajasthan | #16 |
| **Sawai Madhopur** | Rajasthan | #17 |
| **Kota** | Rajasthan | #18 |
| **Neemrana** | Rajasthan | #19 |
| **Kovalam** | Kerala | #25 |
| **Athirappilly** | Kerala | #32 |
| **Marari** | Kerala | #34 |
| **Thiruvananthapuram** | Kerala | #35 |
| **Aurangabad** | Maharashtra | #39 |
| **Kolhapur** | Maharashtra | #43 |
| **Nagpur** | Maharashtra | #44 |
| **Shirdi** | Maharashtra | #47 |
| **Coorg** | Karnataka | #51 |
| **Chikmagalur** | Karnataka | #54 |
| **Udupi** | Karnataka | #55 |
| **Aihole** | Karnataka | #58 |
| **Jog Falls** | Karnataka | #59 |
| **Kabini** | Karnataka | #61 |
| **Chitradurga** | Karnataka | #63 |
| **Warangal** | Telangana | #65 |
| **Vijayawada** | Andhra Pradesh | #69 |
| **Amaravati** | Andhra Pradesh | #70 |
| **Guwahati** | Assam | #75 |
| **Tiruchirappalli** | Tamil Nadu | #87 |
| **Pondicherry** | Puducherry | #89 |
| **Chitrakoot** | Uttar Pradesh | #99 |
| **Indore** | Madhya Pradesh | #102 |
| **Jabalpur** | Madhya Pradesh | #106 |
| **Leh** | Ladakh | #110 |
| **Patiala** | Punjab | #130 |
| **Bhubaneswar** | Odisha | #140 |
| **Ranchi** | Jharkhand | #144 |
| **Deoghar** | Jharkhand | #145 |
| **Hazaribagh** | Jharkhand | #146 |
| **Raipur** | Chhattisgarh | #147 |
| **Amarkantak** | Madhya Pradesh | #149 |

---

## 5. List 3: AMBIGUOUS_MATCHES (2 Items)

The following matches exhibit minor naming/state variations or compound naming differences:

| Current Candidate | Old File Candidate | Reason for Ambiguity |
| :--- | :--- | :--- |
| `#138 Patna (Bihar)` | `#67 Visakhapatnam (Andhra Pradesh)` | Name matches but state differs: Master='Bihar' vs Old='Andhra Pradesh' |
| `#152 Chitrakoot (Madhya Pradesh / Uttar Pradesh)` | `#99 Chitrakoot (Uttar Pradesh) | #152 Chitrakoot (Uttar Pradesh)` | Multiple matching entries in old file with state variations |

---

## 6. List 4: DUPLICATE_OLD_FILE_DESTINATIONS (19 Repeated Destinations)

The following **19 destinations** appear **multiple times** in `destinations(1).txt`:

| Destination Name | State(s) | Old File Catalog Numbers |
| :--- | :--- | :--- |
| **Agra** | Uttar Pradesh | #2, #94 |
| **Alappuzha** | Kerala | #20, #157 |
| **Varkala** | Kerala | #26, #156 |
| **Kumarakom** | Kerala | #27, #158 |
| **Goa** | Goa | #48, #109 |
| **Hampi** | Karnataka | #49, #163 |
| **Bengaluru** | Karnataka | #53, #92 |
| **Badami** | Karnataka | #56, #164 |
| **Srisailam** | Andhra Pradesh | #66, #165 |
| **Rameswaram** | Tamil Nadu | #82, #161 |
| **Kanyakumari** | Tamil Nadu | #83, #162 |
| **Tharangambadi** | Tamil Nadu | #90, #160 |
| **Dhanushkodi** | Tamil Nadu | #91, #159 |
| **Delhi** | Delhi | #93, #108 |
| **Chitrakoot** | Uttar Pradesh | #99, #152 |
| **Orchha** | Madhya Pradesh | #104, #153 |
| **Mandu** | Madhya Pradesh | #107, #151 |
| **Dharamshala** | Himachal Pradesh | #117, #131 |
| **Poovar** | Kerala | #154, #155 |

---

## 7. Complete 165 Master Catalog Semantic Match Classification

| Catalog # | Master Destination Name | State | Old File Match | Old File # | Classification Status |
| :---: | :--- | :--- | :--- | :---: | :---: |
| #1 | **Jaipur** | Rajasthan | Jaipur | #1 | `MATCHED` |
| #2 | **Agra** | Uttar Pradesh | Agra | #2 | `MATCHED` |
| #3 | **Varanasi** | Uttar Pradesh | Varanasi | #3 | `MATCHED` |
| #4 | **Udaipur** | Rajasthan | Udaipur | #4 | `MATCHED` |
| #5 | **Jodhpur** | Rajasthan | Jodhpur | #5 | `MATCHED` |
| #6 | **Jaisalmer** | Rajasthan | Jaisalmer | #6 | `MATCHED` |
| #7 | **Pushkar** | Rajasthan | Pushkar | #7 | `MATCHED` |
| #8 | **Manali** | Himachal Pradesh | Manali | #115 | `MATCHED` |
| #9 | **Shimla** | Himachal Pradesh | Shimla | #116 | `MATCHED` |
| #10 | **Rishikesh** | Uttarakhand | Rishikesh | #121 | `MATCHED` |
| #11 | **Amritsar** | Punjab | Amritsar | #128 | `MATCHED` |
| #12 | **Ladakh** | Ladakh | *None* | *N/A* | **`NOT_FOUND`** |
| #13 | **Srinagar** | Jammu & Kashmir | Srinagar | #111 | `MATCHED` |
| #14 | **Dharamshala** | Himachal Pradesh | Dharamshala | #117 | `MATCHED` |
| #15 | **Mussoorie** | Uttarakhand | Mussoorie | #123 | `MATCHED` |
| #16 | **Nainital** | Uttarakhand | Nainital | #124 | `MATCHED` |
| #17 | **Haridwar** | Uttarakhand | Haridwar | #122 | `MATCHED` |
| #18 | **Mathura-Vrindavan** | Uttar Pradesh | Mathura-Vrindavan | #96 | `MATCHED` |
| #19 | **Khajuraho** | Madhya Pradesh | Khajuraho | #100 | `MATCHED` |
| #20 | **Alappuzha** | Kerala | Alappuzha | #20 | `MATCHED` |
| #21 | **Munnar** | Kerala | Munnar | #21 | `MATCHED` |
| #22 | **Kochi** | Kerala | Kochi | #22 | `MATCHED` |
| #23 | **Mysuru** | Karnataka | Mysuru | #50 | `MATCHED` |
| #24 | **Hampi** | Karnataka | Hampi | #49 | `MATCHED` |
| #25 | **Ooty** | Tamil Nadu | Ooty | #79 | `MATCHED` |
| #26 | **Puducherry** | Puducherry | *None* | *N/A* | **`NOT_FOUND`** |
| #27 | **Madurai** | Tamil Nadu | Madurai | #81 | `MATCHED` |
| #28 | **Wayanad** | Kerala | Wayanad | #24 | `MATCHED` |
| #29 | **Kanyakumari** | Tamil Nadu | Kanyakumari | #83 | `MATCHED` |
| #30 | **Varkala** | Kerala | Varkala | #26 | `MATCHED` |
| #31 | **Kodaikanal** | Tamil Nadu | Kodaikanal | #80 | `MATCHED` |
| #32 | **Mahabalipuram** | Tamil Nadu | Mahabalipuram | #85 | `MATCHED` |
| #33 | **Chennai** | Tamil Nadu | Chennai | #84 | `MATCHED` |
| #34 | **Hyderabad** | Telangana | Hyderabad | #64 | `MATCHED` |
| #35 | **Bengaluru** | Karnataka | Bengaluru | #53 | `MATCHED` |
| #36 | **Gokarna** | Karnataka | Gokarna | #52 | `MATCHED` |
| #37 | **Kolkata** | West Bengal | Kolkata | #134 | `MATCHED` |
| #38 | **Darjeeling** | West Bengal | Darjeeling | #132 | `MATCHED` |
| #39 | **Gangtok** | Sikkim | *None* | *N/A* | **`NOT_FOUND`** |
| #40 | **Shillong** | Meghalaya | Shillong | #72 | `MATCHED` |
| #41 | **Cherrapunji (Sohra)** | Meghalaya | Cherrapunji | #73 | `MATCHED` |
| #42 | **Kaziranga** | Assam | Kaziranga | #74 | `MATCHED` |
| #43 | **Puri** | Odisha | Puri | #141 | `MATCHED` |
| #44 | **Konark** | Odisha | Konark | #142 | `MATCHED` |
| #45 | **Mumbai** | Maharashtra | Mumbai | #36 | `MATCHED` |
| #46 | **Pune** | Maharashtra | Pune | #37 | `MATCHED` |
| #47 | **Lonavala-Khandala** | Maharashtra | Lonavala | #41 | `MATCHED` |
| #48 | **Mahabaleshwar** | Maharashtra | Mahabaleshwar | #40 | `MATCHED` |
| #49 | **Ahmedabad** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #50 | **Rann of Kutch** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #51 | **Bhopal** | Madhya Pradesh | Bhopal | #101 | `MATCHED` |
| #52 | **Ujjain** | Madhya Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #53 | **Gwalior** | Madhya Pradesh | Gwalior | #103 | `MATCHED` |
| #54 | **Orchha** | Madhya Pradesh | Orchha | #104 | `MATCHED` |
| #55 | **Pachmarhi** | Madhya Pradesh | Pachmarhi | #105 | `MATCHED` |
| #56 | **Lucknow** | Uttar Pradesh | Lucknow | #95 | `MATCHED` |
| #57 | **Ayodhya** | Uttar Pradesh | Ayodhya | #98 | `MATCHED` |
| #58 | **Prayagraj** | Uttar Pradesh | Prayagraj | #97 | `MATCHED` |
| #59 | **Chittorgarh** | Rajasthan | Chittorgarh | #13 | `MATCHED` |
| #60 | **Bikaner** | Rajasthan | Bikaner | #10 | `MATCHED` |
| #61 | **Mount Abu** | Rajasthan | Mount Abu | #8 | `MATCHED` |
| #62 | **Ranthambore** | Rajasthan | Ranthambore | #9 | `MATCHED` |
| #63 | **Bundi** | Rajasthan | Bundi | #12 | `MATCHED` |
| #64 | **Dalhousie** | Himachal Pradesh | Dalhousie | #118 | `MATCHED` |
| #65 | **Kasauli** | Himachal Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #66 | **Spiti Valley** | Himachal Pradesh | Spiti Valley | #120 | `MATCHED` |
| #67 | **Auli** | Uttarakhand | Auli | #125 | `MATCHED` |
| #68 | **Gulmarg** | Jammu & Kashmir | Gulmarg | #112 | `MATCHED` |
| #69 | **Pahalgam** | Jammu & Kashmir | Pahalgam | #113 | `MATCHED` |
| #70 | **Tawang** | Arunachal Pradesh | Tawang | #77 | `MATCHED` |
| #71 | **Champhai / Aizawl Circuit** | Mizoram | Champhai / Aizawl Circuit | #71 | `MATCHED` |
| #72 | **Kalimpong** | West Bengal | Kalimpong | #133 | `MATCHED` |
| #73 | **Majuli** | Assam | Majuli | #76 | `MATCHED` |
| #74 | **Ziro Valley** | Arunachal Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #75 | **Andaman Islands** | Andaman & Nicobar Islands | *None* | *N/A* | **`NOT_FOUND`** |
| #76 | **Lakshadweep** | Lakshadweep | *None* | *N/A* | **`NOT_FOUND`** |
| #77 | **Chikkamagaluru** | Karnataka | *None* | *N/A* | **`NOT_FOUND`** |
| #78 | **Bandipur** | Karnataka | Bandipur | #78 | `MATCHED` |
| #79 | **Nagarhole** | Karnataka | *None* | *N/A* | **`NOT_FOUND`** |
| #80 | **Badami-Pattadakal** | Karnataka | Badami | #56 | `MATCHED` |
| #81 | **Murudeshwar** | Karnataka | *None* | *N/A* | **`NOT_FOUND`** |
| #82 | **Dandeli** | Karnataka | Dandeli | #60 | `MATCHED` |
| #83 | **Yercaud** | Tamil Nadu | *None* | *N/A* | **`NOT_FOUND`** |
| #84 | **Valparai** | Tamil Nadu | *None* | *N/A* | **`NOT_FOUND`** |
| #85 | **Chettinad** | Tamil Nadu | *None* | *N/A* | **`NOT_FOUND`** |
| #86 | **Thanjavur** | Tamil Nadu | Thanjavur | #86 | `MATCHED` |
| #87 | **Rameswaram** | Tamil Nadu | Rameswaram | #82 | `MATCHED` |
| #88 | **Tirupati** | Andhra Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #89 | **Visakhapatnam** | Andhra Pradesh | Visakhapatnam | #67 | `MATCHED` |
| #90 | **Araku Valley** | Andhra Pradesh | Araku Valley | #68 | `MATCHED` |
| #91 | **Bhedaghat** | Madhya Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #92 | **Kanha** | Madhya Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #93 | **Bandhavgarh** | Madhya Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #94 | **Sundarbans** | West Bengal | Sundarbans | #135 | `MATCHED` |
| #95 | **Bodh Gaya** | Bihar | Bodh Gaya | #136 | `MATCHED` |
| #96 | **Nashik** | Maharashtra | Nashik | #38 | `MATCHED` |
| #97 | **Chhatrapati Sambhajinagar** | Maharashtra | *None* | *N/A* | **`NOT_FOUND`** |
| #98 | **Alibaug** | Maharashtra | Alibaug | #42 | `MATCHED` |
| #99 | **Matheran** | Maharashtra | *None* | *N/A* | **`NOT_FOUND`** |
| #100 | **Tarkarli** | Maharashtra | *None* | *N/A* | **`NOT_FOUND`** |
| #101 | **Dwarka** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #102 | **Somnath** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #103 | **Gir** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #104 | **Statue of Unity** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #105 | **Saputara** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #106 | **Manas** | Assam | *None* | *N/A* | **`NOT_FOUND`** |
| #107 | **Diu** | Dadra and Nagar Haveli and Daman and Diu | *None* | *N/A* | **`NOT_FOUND`** |
| #108 | **Delhi** | Delhi | Delhi | #93 | `MATCHED` |
| #109 | **Goa** | Goa | Goa | #48 | `MATCHED` |
| #110 | **Champaner-Pavagadh** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #111 | **Dholavira** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #112 | **Modhera-Patan** | Gujarat | *None* | *N/A* | **`NOT_FOUND`** |
| #113 | **Vaishno Devi** | Jammu & Kashmir | *None* | *N/A* | **`NOT_FOUND`** |
| #114 | **Shettihalli / Sakleshpur** | Karnataka | Sakleshpur | #62 | `MATCHED` |
| #115 | **Kerala** | Kerala | *None* | *N/A* | **`NOT_FOUND`** |
| #116 | **Thekkady-Periyar** | Kerala | Thekkady | #23 | `MATCHED` |
| #117 | **Kumarakom** | Kerala | Kumarakom | #27 | `MATCHED` |
| #118 | **Bekal** | Kerala | Bekal | #31 | `MATCHED` |
| #119 | **Vagamon** | Kerala | Vagamon | #33 | `MATCHED` |
| #120 | **Kozhikode** | Kerala | Kozhikode | #29 | `MATCHED` |
| #121 | **Sanchi** | Madhya Pradesh | Sanchi | #139 | `MATCHED` |
| #122 | **Omkareshwar** | Madhya Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #123 | **Ajanta Caves** | Maharashtra | Ajanta | #45 | `MATCHED` |
| #124 | **Ellora Caves** | Maharashtra | Ellora | #46 | `MATCHED` |
| #125 | **Bhimashankar** | Maharashtra | *None* | *N/A* | **`NOT_FOUND`** |
| #126 | **Lonar** | Maharashtra | *None* | *N/A* | **`NOT_FOUND`** |
| #127 | **Dawki** | Meghalaya | *None* | *N/A* | **`NOT_FOUND`** |
| #128 | **Chilika Lake** | Odisha | *None* | *N/A* | **`NOT_FOUND`** |
| #129 | **Ajmer** | Rajasthan | Ajmer | #11 | `MATCHED` |
| #130 | **Shekhawati** | Rajasthan | *None* | *N/A* | **`NOT_FOUND`** |
| #131 | **Ranakpur** | Rajasthan | *None* | *N/A* | **`NOT_FOUND`** |
| #132 | **Kanchipuram** | Tamil Nadu | Kanchipuram | #88 | `MATCHED` |
| #133 | **Sarnath** | Uttar Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #134 | **Jim Corbett** | Uttarakhand | Jim Corbett | #126 | `MATCHED` |
| #135 | **Valley of Flowers** | Uttarakhand | Valley of Flowers | #127 | `MATCHED` |
| #136 | **Kedarnath** | Uttarakhand | *None* | *N/A* | **`NOT_FOUND`** |
| #137 | **Badrinath** | Uttarakhand | *None* | *N/A* | **`NOT_FOUND`** |
| #138 | **Patna** | Bihar | *None* | *N/A* | **`NOT_FOUND`** |
| #139 | **Nalanda** | Bihar | Nalanda | #137 | `MATCHED` |
| #140 | **Rajgir** | Bihar | Rajgir | #138 | `MATCHED` |
| #141 | **Gaya** | Bihar | *None* | *N/A* | **`NOT_FOUND`** |
| #142 | **Cuttack** | Odisha | Cuttack | #143 | `MATCHED` |
| #143 | **Daringbadi** | Odisha | *None* | *N/A* | **`NOT_FOUND`** |
| #144 | **Sambalpur** | Odisha | *None* | *N/A* | **`NOT_FOUND`** |
| #145 | **Digha** | West Bengal | *None* | *N/A* | **`NOT_FOUND`** |
| #146 | **Murshidabad** | West Bengal | *None* | *N/A* | **`NOT_FOUND`** |
| #147 | **Shantiniketan** | West Bengal | *None* | *N/A* | **`NOT_FOUND`** |
| #148 | **Bishnupur** | West Bengal | *None* | *N/A* | **`NOT_FOUND`** |
| #149 | **Jagdalpur** | Chhattisgarh | Jagdalpur | #148 | `MATCHED` |
| #150 | **Maheshwar** | Madhya Pradesh | Maheshwar | #150 | `MATCHED` |
| #151 | **Mandu** | Madhya Pradesh | Mandu | #107 | `MATCHED` |
| #152 | **Chitrakoot** | Madhya Pradesh / Uttar Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #153 | **Thrissur** | Kerala | Thrissur | #28 | `MATCHED` |
| #154 | **Kannur** | Kerala | Kannur | #30 | `MATCHED` |
| #155 | **Poovar** | Kerala | Poovar | #154 | `MATCHED` |
| #156 | **Tirunelveli** | Tamil Nadu | *None* | *N/A* | **`NOT_FOUND`** |
| #157 | **Velankanni** | Tamil Nadu | *None* | *N/A* | **`NOT_FOUND`** |
| #158 | **Hogenakkal** | Tamil Nadu | *None* | *N/A* | **`NOT_FOUND`** |
| #159 | **Dhanushkodi** | Tamil Nadu | Dhanushkodi | #91 | `MATCHED` |
| #160 | **Tranquebar (Tharangambadi)** | Tamil Nadu | Tharangambadi | #90 | `MATCHED` |
| #161 | **Chandigarh** | Chandigarh | Chandigarh | #129 | `MATCHED` |
| #162 | **Kasol** | Himachal Pradesh | Kasol | #119 | `MATCHED` |
| #163 | **Kausani** | Uttarakhand | *None* | *N/A* | **`NOT_FOUND`** |
| #164 | **Gandikota** | Andhra Pradesh | *None* | *N/A* | **`NOT_FOUND`** |
| #165 | **Srisailam** | Andhra Pradesh | Srisailam | #66 | `MATCHED` |

---

## 8. Final Audit Verdict

```text
REMAINING_DESTINATION_AUDIT = PASS
```

*Every destination in the 165 master catalog has been classified as MATCHED, NOT_FOUND, or AMBIGUOUS, and every old-file entry has been classified as MATCHED, EXTRA, or DUPLICATE.*
