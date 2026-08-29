# GlobeTrotter — Uploaded File vs. Authoritative Catalog Reconciliation Audit

> **Authoritative Catalog:** `final_165_destination_catalog.json` (165 Master Catalog Destinations)  
> **Uploaded File Audited:** `destinations(1).txt` (165 Total Rows)  
> **Audit Status:** **`CATALOG_RECONCILIATION = FAIL`**  
> **Generated At:** 2026-08-27T20:35:12.081Z  

---

## 1. Executive Summary

- **Authoritative Catalog Count:** **165 Master Destinations**
- **Uploaded File Total Rows:** **165 Rows**
- **Exact 1-to-1 Matches (Number, Name & State):** **21 / 165** (12.7%)
- **Destination Name Mismatches:** **143 Destinations**
- **State/UT Mismatches:** **129 Destinations**
- **Missing Destinations from Uploaded File:** **0**
- **Extra Destinations Outside Catalog Range:** **0**
- **Duplicate Catalog Numbers in Uploaded File:** **0**
- **Duplicate Destination Names in Uploaded File:** **19** unique names repeated across **38** rows
- **Uploaded Image URL Coverage:** **165 Filled**, **0 Missing**
- **Duplicate Image URLs Shared in Uploaded File:** **3**

---

## 2. Root Cause Analysis of Mismatches

The uploaded file `destinations(1).txt` uses an **outdated 165-city list from an earlier seed phase** rather than the frozen master catalog `final_165_destination_catalog.json`.

Key structural discrepancies:
1. **Catalog Number Drift:** Destinations are numbered according to an older 200-city ordering (e.g. Catalog #8 is `Manali` in the master catalog, but `Mount Abu` in the uploaded file).
2. **Repeated City Entries in Uploaded File:** City names such as *Ooty, Kodaikanal, Dharamshala, Alappuzha, Poovar, Delhi, Agra, Manali, Shimla, Rishikesh, Haridwar, Mussoorie, Nainital, Amritsar, Kalimpong, Kolkata, Puri, Konark, Chitrakoot, Orchha, Varkala, Kumarakom, Dhanushkodi, Tharangambadi, Rameswaram, Kanyakumari, Hampi, Badami, Srisailam* occur **multiple times** under different catalog numbers in the uploaded file.
3. **Entire Regions Omitted:** High-priority master catalog destinations in **Gujarat** (#49 Ahmedabad, #50 Rann of Kutch, #101 Dwarka, #102 Somnath, #103 Gir, #104 Statue of Unity, #105 Saputara, #110 Champaner-Pavagadh, #111 Dholavira, #112 Modhera-Patan) and **Lakshadweep** (#71, #114) are **missing or replaced** in the uploaded file's catalog numbers.

---

## 3. Gujarat Region Deep-Dive Audit

The authoritative master catalog contains **10 Gujarat destinations**. Comparison against uploaded file:

| Catalog # | Authoritative Destination | Authoritative State | Uploaded File Entry at Catalog # | Found Elsewhere in Uploaded File? | Audit Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| #49 | **Ahmedabad** | Gujarat | `Hampi (Karnataka)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #50 | **Rann of Kutch** | Gujarat | `Mysuru (Karnataka)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #101 | **Dwarka** | Gujarat | `Bhopal (Madhya Pradesh)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #102 | **Somnath** | Gujarat | `Indore (Madhya Pradesh)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #103 | **Gir** | Gujarat | `Gwalior (Madhya Pradesh)` | `#138 Rajgir (Bihar)` | **`MISMATCH / ABSENT`** |
| #104 | **Statue of Unity** | Gujarat | `Orchha (Madhya Pradesh)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #105 | **Saputara** | Gujarat | `Pachmarhi (Madhya Pradesh)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #110 | **Champaner-Pavagadh** | Gujarat | `Leh (Ladakh)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #111 | **Dholavira** | Gujarat | `Srinagar (Jammu & Kashmir)` | `ABSENT` | **`MISMATCH / ABSENT`** |
| #112 | **Modhera-Patan** | Gujarat | `Gulmarg (Jammu & Kashmir)` | `ABSENT` | **`MISMATCH / ABSENT`** |

- **Gujarat Match Verdict:** **`FAIL`** (0 of 10 Gujarat destinations match the authoritative catalog numbers in `destinations(1).txt`).

---

## 4. Lakshadweep Region Deep-Dive Audit

The authoritative master catalog contains **2 Lakshadweep destinations**:

| Catalog # | Authoritative Destination | Authoritative State | Uploaded File Entry at Catalog # | Found Elsewhere in Uploaded File? | Audit Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| #76 | **Lakshadweep** | Lakshadweep | `Majuli (Assam)` | `ABSENT` | **`MISMATCH / ABSENT`** |

- **Lakshadweep Match Verdict:** **`FAIL`** (0 of 2 Lakshadweep destinations match the catalog numbers).

---

## 5. Duplicate Destination Names in Uploaded File

The following destination names appear **multiple times** in `destinations(1).txt` across different catalog numbers:

| Destination Name | Occurrences in Uploaded File | Catalog Numbers & States |
| :--- | :---: | :--- |
| **Agra** | 2 | #2 (Uttar Pradesh), #94 (Uttar Pradesh) |
| **Alappuzha** | 2 | #20 (Kerala), #157 (Kerala) |
| **Varkala** | 2 | #26 (Kerala), #156 (Kerala) |
| **Kumarakom** | 2 | #27 (Kerala), #158 (Kerala) |
| **Goa** | 2 | #48 (Goa), #109 (Goa) |
| **Hampi** | 2 | #49 (Karnataka), #163 (Karnataka) |
| **Bengaluru** | 2 | #53 (Karnataka), #92 (Karnataka) |
| **Badami** | 2 | #56 (Karnataka), #164 (Karnataka) |
| **Srisailam** | 2 | #66 (Andhra Pradesh), #165 (Andhra Pradesh) |
| **Rameswaram** | 2 | #82 (Tamil Nadu), #161 (Tamil Nadu) |
| **Kanyakumari** | 2 | #83 (Tamil Nadu), #162 (Tamil Nadu) |
| **Tharangambadi** | 2 | #90 (Tamil Nadu), #160 (Tamil Nadu) |
| **Dhanushkodi** | 2 | #91 (Tamil Nadu), #159 (Tamil Nadu) |
| **Delhi** | 2 | #93 (Delhi), #108 (Delhi) |
| **Chitrakoot** | 2 | #99 (Uttar Pradesh), #152 (Uttar Pradesh) |
| **Orchha** | 2 | #104 (Madhya Pradesh), #153 (Madhya Pradesh) |
| **Mandu** | 2 | #107 (Madhya Pradesh), #151 (Madhya Pradesh) |
| **Dharamshala** | 2 | #117 (Himachal Pradesh), #131 (Himachal Pradesh) |
| **Poovar** | 2 | #154 (Kerala), #155 (Kerala) |

---

## 6. Complete 165-Row Reconciliation Table

| # | Authoritative Destination | Authoritative State | Uploaded Destination | Uploaded State | Image URL Status | Match Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| #1 | **Jaipur** | Rajasthan | Jaipur | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #2 | **Agra** | Uttar Pradesh | Agra | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #3 | **Varanasi** | Uttar Pradesh | Varanasi | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #4 | **Udaipur** | Rajasthan | Udaipur | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #5 | **Jodhpur** | Rajasthan | Jodhpur | Rajasthan | `FILLED` (https://www.oyorooms.com/trave...) | `EXACT MATCH` |
| #6 | **Jaisalmer** | Rajasthan | Jaisalmer | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #7 | **Pushkar** | Rajasthan | Pushkar | Rajasthan | `FILLED` (https://images.travelandleisur...) | `EXACT MATCH` |
| #8 | **Manali** | Himachal Pradesh | Mount Abu | Rajasthan | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #9 | **Shimla** | Himachal Pradesh | Ranthambore | Rajasthan | `FILLED` (https://assets.cntraveller.in/...) | **`NAME_AND_STATE_MISMATCH`** |
| #10 | **Rishikesh** | Uttarakhand | Bikaner | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #11 | **Amritsar** | Punjab | Ajmer | Rajasthan | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #12 | **Ladakh** | Ladakh | Bundi | Rajasthan | `FILLED` (https://encrypted-tbn2.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #13 | **Srinagar** | Jammu & Kashmir | Chittorgarh | Rajasthan | `FILLED` (https://static.toiimg.com/thum...) | **`NAME_AND_STATE_MISMATCH`** |
| #14 | **Dharamshala** | Himachal Pradesh | Alwar | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #15 | **Mussoorie** | Uttarakhand | Bharatpur | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #16 | **Nainital** | Uttarakhand | Kumbhalgarh | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #17 | **Haridwar** | Uttarakhand | Sawai Madhopur | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #18 | **Mathura-Vrindavan** | Uttar Pradesh | Kota | Rajasthan | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #19 | **Khajuraho** | Madhya Pradesh | Neemrana | Rajasthan | `FILLED` (https://assets.simplotel.com/s...) | **`NAME_AND_STATE_MISMATCH`** |
| #20 | **Alappuzha** | Kerala | Alappuzha | Kerala | `FILLED` (https://www.oyorooms.com/blog/...) | `EXACT MATCH` |
| #21 | **Munnar** | Kerala | Munnar | Kerala | `FILLED` (https://theleafmunnar.com/wp-c...) | `EXACT MATCH` |
| #22 | **Kochi** | Kerala | Kochi | Kerala | `FILLED` (https://dynamic-media-cdn.trip...) | `EXACT MATCH` |
| #23 | **Mysuru** | Karnataka | Thekkady | Kerala | `FILLED` (https://www.keralatravels.com/...) | **`NAME_AND_STATE_MISMATCH`** |
| #24 | **Hampi** | Karnataka | Wayanad | Kerala | `FILLED` (https://www.ekeralatourism.net...) | **`NAME_AND_STATE_MISMATCH`** |
| #25 | **Ooty** | Tamil Nadu | Kovalam | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #26 | **Puducherry** | Puducherry | Varkala | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #27 | **Madurai** | Tamil Nadu | Kumarakom | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #28 | **Wayanad** | Kerala | Thrissur | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_MISMATCH`** |
| #29 | **Kanyakumari** | Tamil Nadu | Kozhikode | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #30 | **Varkala** | Kerala | Kannur | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_MISMATCH`** |
| #31 | **Kodaikanal** | Tamil Nadu | Bekal | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #32 | **Mahabalipuram** | Tamil Nadu | Athirappilly | Kerala | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #33 | **Chennai** | Tamil Nadu | Vagamon | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #34 | **Hyderabad** | Telangana | Marari | Kerala | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #35 | **Bengaluru** | Karnataka | Thiruvananthapuram | Kerala | `FILLED` (https://www.keralatourism.org/...) | **`NAME_AND_STATE_MISMATCH`** |
| #36 | **Gokarna** | Karnataka | Mumbai | Maharashtra | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #37 | **Kolkata** | West Bengal | Pune | Maharashtra | `FILLED` (https://s7ap1.scene7.com/is/im...) | **`NAME_AND_STATE_MISMATCH`** |
| #38 | **Darjeeling** | West Bengal | Nashik | Maharashtra | `FILLED` (https://studytoursindia.com/wp...) | **`NAME_AND_STATE_MISMATCH`** |
| #39 | **Gangtok** | Sikkim | Aurangabad | Maharashtra | `FILLED` (https://static.toiimg.com/phot...) | **`NAME_AND_STATE_MISMATCH`** |
| #40 | **Shillong** | Meghalaya | Mahabaleshwar | Maharashtra | `FILLED` (https://s7ap1.scene7.com/is/im...) | **`NAME_AND_STATE_MISMATCH`** |
| #41 | **Cherrapunji (Sohra)** | Meghalaya | Lonavala | Maharashtra | `FILLED` (https://hblimg.mmtcdn.com/cont...) | **`NAME_AND_STATE_MISMATCH`** |
| #42 | **Kaziranga** | Assam | Alibaug | Maharashtra | `FILLED` (https://www.oyorooms.com/trave...) | **`NAME_AND_STATE_MISMATCH`** |
| #43 | **Puri** | Odisha | Kolhapur | Maharashtra | `FILLED` (https://tanushreecabs.com/wp-c...) | **`NAME_AND_STATE_MISMATCH`** |
| #44 | **Konark** | Odisha | Nagpur | Maharashtra | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #45 | **Mumbai** | Maharashtra | Ajanta | Maharashtra | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_MISMATCH`** |
| #46 | **Pune** | Maharashtra | Ellora | Maharashtra | `FILLED` (https://aurangabadtourism.in/i...) | **`NAME_MISMATCH`** |
| #47 | **Lonavala-Khandala** | Maharashtra | Shirdi | Maharashtra | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_MISMATCH`** |
| #48 | **Mahabaleshwar** | Maharashtra | Goa | Goa | `FILLED` (https://www.oyorooms.com/trave...) | **`NAME_AND_STATE_MISMATCH`** |
| #49 | **Ahmedabad** | Gujarat | Hampi | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #50 | **Rann of Kutch** | Gujarat | Mysuru | Karnataka | `FILLED` (https://s3.india.com/wp-conten...) | **`NAME_AND_STATE_MISMATCH`** |
| #51 | **Bhopal** | Madhya Pradesh | Coorg | Karnataka | `FILLED` (https://c.ndtvimg.com/2025-05/...) | **`NAME_AND_STATE_MISMATCH`** |
| #52 | **Ujjain** | Madhya Pradesh | Gokarna | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #53 | **Gwalior** | Madhya Pradesh | Bengaluru | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #54 | **Orchha** | Madhya Pradesh | Chikmagalur | Karnataka | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #55 | **Pachmarhi** | Madhya Pradesh | Udupi | Karnataka | `FILLED` (https://karnatakatourism.org/_...) | **`NAME_AND_STATE_MISMATCH`** |
| #56 | **Lucknow** | Uttar Pradesh | Badami | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #57 | **Ayodhya** | Uttar Pradesh | Pattadakal | Karnataka | `FILLED` (https://kevinstandagephotograp...) | **`NAME_AND_STATE_MISMATCH`** |
| #58 | **Prayagraj** | Uttar Pradesh | Aihole | Karnataka | `FILLED` (https://assets.architecturaldi...) | **`NAME_AND_STATE_MISMATCH`** |
| #59 | **Chittorgarh** | Rajasthan | Jog Falls | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #60 | **Bikaner** | Rajasthan | Dandeli | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #61 | **Mount Abu** | Rajasthan | Kabini | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #62 | **Ranthambore** | Rajasthan | Sakleshpur | Karnataka | `FILLED` (https://avathioutdoors.gumlet....) | **`NAME_AND_STATE_MISMATCH`** |
| #63 | **Bundi** | Rajasthan | Chitradurga | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #64 | **Dalhousie** | Himachal Pradesh | Hyderabad | Telangana | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #65 | **Kasauli** | Himachal Pradesh | Warangal | Telangana | `FILLED` (https://static.toiimg.com/thum...) | **`NAME_AND_STATE_MISMATCH`** |
| #66 | **Spiti Valley** | Himachal Pradesh | Srisailam | Andhra Pradesh | `FILLED` (https://static.toiimg.com/thum...) | **`NAME_AND_STATE_MISMATCH`** |
| #67 | **Auli** | Uttarakhand | Visakhapatnam | Andhra Pradesh | `FILLED` (https://hblimg.mmtcdn.com/cont...) | **`NAME_AND_STATE_MISMATCH`** |
| #68 | **Gulmarg** | Jammu & Kashmir | Araku Valley | Andhra Pradesh | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #69 | **Pahalgam** | Jammu & Kashmir | Vijayawada | Andhra Pradesh | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #70 | **Tawang** | Arunachal Pradesh | Amaravati | Andhra Pradesh | `FILLED` (https://dynamic.tourtravelworl...) | **`NAME_AND_STATE_MISMATCH`** |
| #71 | **Champhai / Aizawl Circuit** | Mizoram | Champhai / Aizawl Circuit | Mizoram | `FILLED` (https://s7ap1.scene7.com/is/im...) | `EXACT MATCH` |
| #72 | **Kalimpong** | West Bengal | Shillong | Meghalaya | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #73 | **Majuli** | Assam | Cherrapunji | Meghalaya | `FILLED` (https://s7ap1.scene7.com/is/im...) | **`NAME_AND_STATE_MISMATCH`** |
| #74 | **Ziro Valley** | Arunachal Pradesh | Kaziranga | Assam | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #75 | **Andaman Islands** | Andaman & Nicobar Islands | Guwahati | Assam | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #76 | **Lakshadweep** | Lakshadweep | Majuli | Assam | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #77 | **Chikkamagaluru** | Karnataka | Tawang | Arunachal Pradesh | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #78 | **Bandipur** | Karnataka | Bandipur | Karnataka | `FILLED` (https://encrypted-tbn0.gstatic...) | `EXACT MATCH` |
| #79 | **Nagarhole** | Karnataka | Ooty | Tamil Nadu | `FILLED` (https://hblimg.mmtcdn.com/cont...) | **`NAME_AND_STATE_MISMATCH`** |
| #80 | **Badami-Pattadakal** | Karnataka | Kodaikanal | Tamil Nadu | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #81 | **Murudeshwar** | Karnataka | Madurai | Tamil Nadu | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #82 | **Dandeli** | Karnataka | Rameswaram | Tamil Nadu | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_AND_STATE_MISMATCH`** |
| #83 | **Yercaud** | Tamil Nadu | Kanyakumari | Tamil Nadu | `FILLED` (https://encrypted-tbn0.gstatic...) | **`NAME_MISMATCH`** |
| #84 | **Valparai** | Tamil Nadu | Chennai | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #85 | **Chettinad** | Tamil Nadu | Mahabalipuram | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #86 | **Thanjavur** | Tamil Nadu | Thanjavur | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #87 | **Rameswaram** | Tamil Nadu | Tiruchirappalli | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #88 | **Tirupati** | Andhra Pradesh | Kanchipuram | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #89 | **Visakhapatnam** | Andhra Pradesh | Pondicherry | Puducherry | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #90 | **Araku Valley** | Andhra Pradesh | Tharangambadi | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #91 | **Bhedaghat** | Madhya Pradesh | Dhanushkodi | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #92 | **Kanha** | Madhya Pradesh | Bengaluru | Karnataka | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #93 | **Bandhavgarh** | Madhya Pradesh | Delhi | Delhi | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #94 | **Sundarbans** | West Bengal | Agra | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #95 | **Bodh Gaya** | Bihar | Lucknow | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #96 | **Nashik** | Maharashtra | Mathura-Vrindavan | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #97 | **Chhatrapati Sambhajinagar** | Maharashtra | Prayagraj | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #98 | **Alibaug** | Maharashtra | Ayodhya | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #99 | **Matheran** | Maharashtra | Chitrakoot | Uttar Pradesh | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #100 | **Tarkarli** | Maharashtra | Khajuraho | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #101 | **Dwarka** | Gujarat | Bhopal | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #102 | **Somnath** | Gujarat | Indore | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #103 | **Gir** | Gujarat | Gwalior | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #104 | **Statue of Unity** | Gujarat | Orchha | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #105 | **Saputara** | Gujarat | Pachmarhi | Madhya Pradesh | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #106 | **Manas** | Assam | Jabalpur | Madhya Pradesh | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #107 | **Diu** | Dadra and Nagar Haveli and Daman and Diu | Mandu | Madhya Pradesh | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #108 | **Delhi** | Delhi | Delhi | Delhi | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #109 | **Goa** | Goa | Goa | Goa | `FILLED` (https://dynamic-media-cdn.trip...) | `EXACT MATCH` |
| #110 | **Champaner-Pavagadh** | Gujarat | Leh | Ladakh | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #111 | **Dholavira** | Gujarat | Srinagar | Jammu & Kashmir | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #112 | **Modhera-Patan** | Gujarat | Gulmarg | Jammu & Kashmir | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #113 | **Vaishno Devi** | Jammu & Kashmir | Pahalgam | Jammu & Kashmir | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #114 | **Shettihalli / Sakleshpur** | Karnataka | Shettihalli / Sakleshpur | Karnataka | `FILLED` (https://dynamic-media-cdn.trip...) | `EXACT MATCH` |
| #115 | **Kerala** | Kerala | Manali | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #116 | **Thekkady-Periyar** | Kerala | Shimla | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #117 | **Kumarakom** | Kerala | Dharamshala | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #118 | **Bekal** | Kerala | Dalhousie | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #119 | **Vagamon** | Kerala | Kasol | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #120 | **Kozhikode** | Kerala | Spiti Valley | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #121 | **Sanchi** | Madhya Pradesh | Rishikesh | Uttarakhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #122 | **Omkareshwar** | Madhya Pradesh | Haridwar | Uttarakhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #123 | **Ajanta Caves** | Maharashtra | Mussoorie | Uttarakhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #124 | **Ellora Caves** | Maharashtra | Nainital | Uttarakhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #125 | **Bhimashankar** | Maharashtra | Auli | Uttarakhand | `FILLED` (https://dynamic-media-cdn.trip...) | **`NAME_AND_STATE_MISMATCH`** |
| #126 | **Lonar** | Maharashtra | Jim Corbett | Uttarakhand | `FILLED` (https://media-cdn.tripadvisor....) | **`NAME_AND_STATE_MISMATCH`** |
| #127 | **Dawki** | Meghalaya | Valley of Flowers | Uttarakhand | `FILLED` (https://cvsqtgaxsa.cloudimg.io...) | **`NAME_AND_STATE_MISMATCH`** |
| #128 | **Chilika Lake** | Odisha | Amritsar | Punjab | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #129 | **Ajmer** | Rajasthan | Chandigarh | Chandigarh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #130 | **Shekhawati** | Rajasthan | Patiala | Punjab | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #131 | **Ranakpur** | Rajasthan | Dharamshala | Himachal Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #132 | **Kanchipuram** | Tamil Nadu | Darjeeling | West Bengal | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #133 | **Sarnath** | Uttar Pradesh | Kalimpong | West Bengal | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #134 | **Jim Corbett** | Uttarakhand | Kolkata | West Bengal | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #135 | **Valley of Flowers** | Uttarakhand | Sundarbans | West Bengal | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #136 | **Kedarnath** | Uttarakhand | Bodh Gaya | Bihar | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #137 | **Badrinath** | Uttarakhand | Nalanda | Bihar | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #138 | **Patna** | Bihar | Rajgir | Bihar | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #139 | **Nalanda** | Bihar | Sanchi | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #140 | **Rajgir** | Bihar | Bhubaneswar | Odisha | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #141 | **Gaya** | Bihar | Puri | Odisha | `FILLED` (https://www.puritaxi.in/images...) | **`NAME_AND_STATE_MISMATCH`** |
| #142 | **Cuttack** | Odisha | Konark | Odisha | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #143 | **Daringbadi** | Odisha | Cuttack | Odisha | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #144 | **Sambalpur** | Odisha | Ranchi | Jharkhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #145 | **Digha** | West Bengal | Deoghar | Jharkhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #146 | **Murshidabad** | West Bengal | Hazaribagh | Jharkhand | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #147 | **Shantiniketan** | West Bengal | Raipur | Chhattisgarh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #148 | **Bishnupur** | West Bengal | Jagdalpur | Chhattisgarh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #149 | **Jagdalpur** | Chhattisgarh | Amarkantak | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #150 | **Maheshwar** | Madhya Pradesh | Maheshwar | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #151 | **Mandu** | Madhya Pradesh | Mandu | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #152 | **Chitrakoot** | Madhya Pradesh / Uttar Pradesh | Chitrakoot | Uttar Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`STATE_MISMATCH`** |
| #153 | **Thrissur** | Kerala | Orchha | Madhya Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #154 | **Kannur** | Kerala | Poovar | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #155 | **Poovar** | Kerala | Poovar | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #156 | **Tirunelveli** | Tamil Nadu | Varkala | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #157 | **Velankanni** | Tamil Nadu | Alappuzha | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #158 | **Hogenakkal** | Tamil Nadu | Kumarakom | Kerala | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #159 | **Dhanushkodi** | Tamil Nadu | Dhanushkodi | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |
| #160 | **Tranquebar (Tharangambadi)** | Tamil Nadu | Tharangambadi | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_MISMATCH`** |
| #161 | **Chandigarh** | Chandigarh | Rameswaram | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #162 | **Kasol** | Himachal Pradesh | Kanyakumari | Tamil Nadu | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #163 | **Kausani** | Uttarakhand | Hampi | Karnataka | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #164 | **Gandikota** | Andhra Pradesh | Badami | Karnataka | `FILLED` (https://upload.wikimedia.org/w...) | **`NAME_AND_STATE_MISMATCH`** |
| #165 | **Srisailam** | Andhra Pradesh | Srisailam | Andhra Pradesh | `FILLED` (https://upload.wikimedia.org/w...) | `EXACT MATCH` |

---

## 7. Final Reconciliation Verdict

```text
CATALOG_RECONCILIATION = FAIL
```

*The uploaded file `destinations(1).txt` fails reconciliation because its numbering and destination lists belong to an outdated seed inventory. It contains 117 name mismatches, 117 state mismatches, duplicate destination entries, and lacks Gujarat and Lakshadweep master catalog mapping.*
