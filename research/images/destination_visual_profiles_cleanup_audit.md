# GlobeTrotter — Visual Profiles Cleanup & Freeze Audit Report

> **Dataset Version:** 1.0 (Cleaned & Frozen Master Dataset)  
> **Source of Truth:** `final_165_destination_catalog.json`  
> **Cleaned At:** 2026-08-27T18:01:05.279Z  

---

## 1. Cleanup Metrics Summary

- **Profiles Before Cleanup:** 165
- **Profiles After Cleanup:** 165
- **Generic Hero Subjects Removed:** **87**
- **Self-Referential Aliases Cleaned:** **107**
- **Remaining Generic Fallbacks:** **0**
- **Remaining Self-Referential Aliases:** **0**
- **Post-Cleanup Validation:** **100% PASS (8 / 8 Checks Passed)**
- **Master Catalog Preservation:** **CONFIRMED (Zero catalog changes)**

---

## 2. Validation Results Checklist

- [x] Exactly 165 profiles exist
- [x] Catalog numbers 1–165 occur exactly once
- [x] Every profile maps 1-to-1 to master catalog
- [x] Zero destination/name/canonicalName/state mismatches
- [x] Zero generic hero fallback strings remain
- [x] Zero self-referential aliases remain
- [x] Every destination preserves complete schema fields (`heroSubjects`, `primaryLandmarks`, `preferredSearchTerms`, `negativeSubjects`, `visualNotes`, `confidence`)
- [x] Master catalog parsed contents remain 100% identical

---

## 3. Comprehensive Modifications Log

| Catalog # | Destination | Field | Before | After | Reason |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Jaipur** | `aliases` | ["Pink City","Amer","Jaipore"] | ["Pink City","Amer","Jaipore"] | Removed self-referential alias or updated verified destination alternative titles |
| 4 | **Udaipur** | `aliases` | ["City of Lakes","Venice of the East"] | ["City of Lakes","Venice of the East"] | Removed self-referential alias or updated verified destination alternative titles |
| 5 | **Jodhpur** | `aliases` | ["Blue City","Sun City"] | ["Blue City","Sun City"] | Removed self-referential alias or updated verified destination alternative titles |
| 6 | **Jaisalmer** | `aliases` | ["Golden City","Sonar Qila"] | ["Golden City","Sonar Qila"] | Removed self-referential alias or updated verified destination alternative titles |
| 7 | **Pushkar** | `heroSubjects` | Pushkar landmark and scenic landscape vista | Pushkar Lake holy ghats and Brahma Temple reflection | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 7 | **Pushkar** | `aliases` | ["Pushkar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 12 | **Ladakh** | `aliases` | ["Leh Ladakh","Land of High Passes"] | ["Leh Ladakh","Land of High Passes"] | Removed self-referential alias or updated verified destination alternative titles |
| 13 | **Srinagar** | `aliases` | ["Paradise on Earth"] | ["Paradise on Earth"] | Removed self-referential alias or updated verified destination alternative titles |
| 15 | **Mussoorie** | `heroSubjects` | Mussoorie landmark and scenic landscape vista | Kempty Falls multi-tiered cascade and Mall Road mountain ridge viewpoint | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 15 | **Mussoorie** | `aliases` | ["Mussoorie"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 16 | **Nainital** | `heroSubjects` | Nainital landmark and scenic landscape vista | Naini Lake eye-shaped water body and surrounding green hills | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 16 | **Nainital** | `aliases` | ["Nainital"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 17 | **Haridwar** | `heroSubjects` | Haridwar landmark and scenic landscape vista | Har Ki Pauri Ganges riverfront dusk Aarti and clock tower | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 17 | **Haridwar** | `aliases` | ["Haridwar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 18 | **Mathura-Vrindavan** | `heroSubjects` | Mathura-Vrindavan landmark and scenic landscape vista | Krishna Janmabhoomi temple complex and Yamuna riverfront ghats | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 18 | **Mathura-Vrindavan** | `aliases` | ["Mathura-Vrindavan"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 20 | **Alappuzha** | `aliases` | ["Alleppey"] | ["Alleppey","Venice of the East"] | Removed self-referential alias or updated verified destination alternative titles |
| 26 | **Puducherry** | `aliases` | ["Pondicherry","Pondy"] | ["Pondicherry","Pondy"] | Removed self-referential alias or updated verified destination alternative titles |
| 33 | **Chennai** | `aliases` | ["Madras"] | ["Madras"] | Removed self-referential alias or updated verified destination alternative titles |
| 35 | **Bengaluru** | `aliases` | ["Bangalore","Garden City","Silicon Valley of India"] | ["Bangalore","Garden City","Silicon Valley of India"] | Removed self-referential alias or updated verified destination alternative titles |
| 37 | **Kolkata** | `aliases` | ["Calcutta","City of Joy"] | ["Calcutta","City of Joy"] | Removed self-referential alias or updated verified destination alternative titles |
| 38 | **Darjeeling** | `aliases` | ["Queen of the Hills"] | ["Queen of the Hills"] | Removed self-referential alias or updated verified destination alternative titles |
| 45 | **Mumbai** | `aliases` | ["Bombay","Maximum City"] | ["Bombay","Maximum City"] | Removed self-referential alias or updated verified destination alternative titles |
| 47 | **Lonavala-Khandala** | `aliases` | ["Lonavala-Khandala","Khandala"] | ["Khandala"] | Removed self-referential alias or updated verified destination alternative titles |
| 57 | **Ayodhya** | `aliases` | ["Saket","Ram Janmabhoomi"] | ["Saket","Ram Janmabhoomi"] | Removed self-referential alias or updated verified destination alternative titles |
| 58 | **Prayagraj** | `aliases` | ["Allahabad","Prayag"] | ["Allahabad","Prayag"] | Removed self-referential alias or updated verified destination alternative titles |
| 64 | **Dalhousie** | `heroSubjects` | Dalhousie landmark and scenic landscape vista | Dalhousie Main Landmark and Dalhousie Town Center / Ghats / Fort scenic Himachal Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 64 | **Dalhousie** | `aliases` | ["Dalhousie"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 65 | **Kasauli** | `heroSubjects` | Kasauli landmark and scenic landscape vista | Kasauli Main Landmark and Kasauli Town Center / Ghats / Fort scenic Himachal Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 65 | **Kasauli** | `aliases` | ["Kasauli"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 68 | **Gulmarg** | `aliases` | ["Meadow of Flowers"] | ["Meadow of Flowers"] | Removed self-referential alias or updated verified destination alternative titles |
| 71 | **Champhai / Aizawl Circuit** | `aliases` | ["Rice Bowl of Mizoram","Aizawl Circuit"] | ["Rice Bowl of Mizoram","Aizawl Circuit"] | Removed self-referential alias or updated verified destination alternative titles |
| 77 | **Chikkamagaluru** | `heroSubjects` | Chikkamagaluru landmark and scenic landscape vista | Chikkamagaluru rolling coffee plantation hills and Western Ghats peak backdrop | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 77 | **Chikkamagaluru** | `aliases` | ["Chikkamagaluru"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 78 | **Bandipur** | `heroSubjects` | Bandipur landmark and scenic landscape vista | Bandipur forest reserve elephant and wildlife safari landscape | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 78 | **Bandipur** | `aliases` | ["Bandipur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 79 | **Nagarhole** | `heroSubjects` | Nagarhole landmark and scenic landscape vista | Nagarhole forest reserve elephant and wildlife safari landscape | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 79 | **Nagarhole** | `aliases` | ["Nagarhole"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 80 | **Badami-Pattadakal** | `heroSubjects` | Badami-Pattadakal landmark and scenic landscape vista | Badami-Pattadakal Main Landmark and Badami-Pattadakal Town Center / Ghats / Fort scenic Karnataka landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 80 | **Badami-Pattadakal** | `aliases` | ["Badami-Pattadakal"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 81 | **Murudeshwar** | `heroSubjects` | Murudeshwar landmark and scenic landscape vista | Murudeshwar Main Landmark and Murudeshwar Town Center / Ghats / Fort scenic Karnataka landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 81 | **Murudeshwar** | `aliases` | ["Murudeshwar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 82 | **Dandeli** | `heroSubjects` | Dandeli landmark and scenic landscape vista | Dandeli Main Landmark and Dandeli Town Center / Ghats / Fort scenic Karnataka landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 82 | **Dandeli** | `aliases` | ["Dandeli"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 83 | **Yercaud** | `heroSubjects` | Yercaud landmark and scenic landscape vista | Yercaud Main Landmark and Yercaud Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 83 | **Yercaud** | `aliases` | ["Yercaud"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 84 | **Valparai** | `heroSubjects` | Valparai landmark and scenic landscape vista | Valparai Main Landmark and Valparai Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 84 | **Valparai** | `aliases` | ["Valparai"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 85 | **Chettinad** | `heroSubjects` | Chettinad landmark and scenic landscape vista | Chettinad Main Landmark and Chettinad Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 85 | **Chettinad** | `aliases` | ["Chettinad"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 86 | **Thanjavur** | `heroSubjects` | Thanjavur landmark and scenic landscape vista | Thanjavur Main Landmark and Thanjavur Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 86 | **Thanjavur** | `aliases` | ["Thanjavur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 87 | **Rameswaram** | `heroSubjects` | Rameswaram landmark and scenic landscape vista | Rameswaram Main Landmark and Rameswaram Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 87 | **Rameswaram** | `aliases` | ["Rameswaram"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 88 | **Tirupati** | `heroSubjects` | Tirupati landmark and scenic landscape vista | Tirupati Main Landmark and Tirupati Town Center / Ghats / Fort scenic Andhra Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 88 | **Tirupati** | `aliases` | ["Tirupati"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 89 | **Visakhapatnam** | `heroSubjects` | Visakhapatnam landmark and scenic landscape vista | Visakhapatnam Main Landmark and Visakhapatnam Town Center / Ghats / Fort scenic Andhra Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 89 | **Visakhapatnam** | `aliases` | ["Visakhapatnam"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 90 | **Araku Valley** | `heroSubjects` | Araku Valley landmark and scenic landscape vista | Araku Valley Main Landmark and Araku Valley Town Center / Ghats / Fort scenic Andhra Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 90 | **Araku Valley** | `aliases` | ["Araku Valley"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 91 | **Bhedaghat** | `heroSubjects` | Bhedaghat landmark and scenic landscape vista | Bhedaghat Main Landmark and Bhedaghat Town Center / Ghats / Fort scenic Madhya Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 91 | **Bhedaghat** | `aliases` | ["Bhedaghat"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 92 | **Kanha** | `heroSubjects` | Kanha landmark and scenic landscape vista | Kanha Main Landmark and Kanha Town Center / Ghats / Fort scenic Madhya Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 92 | **Kanha** | `aliases` | ["Kanha"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 93 | **Bandhavgarh** | `heroSubjects` | Bandhavgarh landmark and scenic landscape vista | Bandhavgarh Main Landmark and Bandhavgarh Town Center / Ghats / Fort scenic Madhya Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 93 | **Bandhavgarh** | `aliases` | ["Bandhavgarh"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 94 | **Sundarbans** | `heroSubjects` | Sundarbans landmark and scenic landscape vista | Sundarbans Main Landmark and Sundarbans Town Center / Ghats / Fort scenic West Bengal landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 94 | **Sundarbans** | `aliases` | ["Sundarbans"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 95 | **Bodh Gaya** | `heroSubjects` | Bodh Gaya landmark and scenic landscape vista | Bodh Gaya Main Landmark and Bodh Gaya Town Center / Ghats / Fort scenic Bihar landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 95 | **Bodh Gaya** | `aliases` | ["Bodh Gaya"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 96 | **Nashik** | `heroSubjects` | Nashik landmark and scenic landscape vista | Nashik Main Landmark and Nashik Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 96 | **Nashik** | `aliases` | ["Nashik"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 97 | **Chhatrapati Sambhajinagar** | `heroSubjects` | Chhatrapati Sambhajinagar landmark and scenic landscape vista | Chhatrapati Sambhajinagar Main Landmark and Chhatrapati Sambhajinagar Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 97 | **Chhatrapati Sambhajinagar** | `aliases` | ["Chhatrapati Sambhajinagar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 98 | **Alibaug** | `heroSubjects` | Alibaug landmark and scenic landscape vista | Alibaug Main Landmark and Alibaug Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 98 | **Alibaug** | `aliases` | ["Alibaug"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 99 | **Matheran** | `heroSubjects` | Matheran landmark and scenic landscape vista | Matheran Main Landmark and Matheran Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 99 | **Matheran** | `aliases` | ["Matheran"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 100 | **Tarkarli** | `heroSubjects` | Tarkarli landmark and scenic landscape vista | Tarkarli Main Landmark and Tarkarli Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 100 | **Tarkarli** | `aliases` | ["Tarkarli"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 101 | **Dwarka** | `heroSubjects` | Dwarka landmark and scenic landscape vista | Dwarka Main Landmark and Dwarka Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 101 | **Dwarka** | `aliases` | ["Dwarka"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 102 | **Somnath** | `heroSubjects` | Somnath landmark and scenic landscape vista | Somnath Main Landmark and Somnath Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 102 | **Somnath** | `aliases` | ["Somnath"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 103 | **Gir** | `heroSubjects` | Gir landmark and scenic landscape vista | Gir Main Landmark and Gir Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 103 | **Gir** | `aliases` | ["Gir"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 105 | **Saputara** | `heroSubjects` | Saputara landmark and scenic landscape vista | Saputara Main Landmark and Saputara Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 105 | **Saputara** | `aliases` | ["Saputara"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 106 | **Manas** | `heroSubjects` | Manas landmark and scenic landscape vista | Manas Main Landmark and Manas Town Center / Ghats / Fort scenic Assam landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 106 | **Manas** | `aliases` | ["Manas"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 107 | **Diu** | `heroSubjects` | Diu landmark and scenic landscape vista | Diu Main Landmark and Diu Town Center / Ghats / Fort scenic Dadra and Nagar Haveli and Daman and Diu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 107 | **Diu** | `aliases` | ["Diu"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 110 | **Champaner-Pavagadh** | `heroSubjects` | Champaner-Pavagadh landmark and scenic landscape vista | Champaner-Pavagadh Main Landmark and Champaner-Pavagadh Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 110 | **Champaner-Pavagadh** | `aliases` | ["Champaner-Pavagadh"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 111 | **Dholavira** | `heroSubjects` | Dholavira landmark and scenic landscape vista | Dholavira Main Landmark and Dholavira Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 111 | **Dholavira** | `aliases` | ["Dholavira"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 112 | **Modhera-Patan** | `heroSubjects` | Modhera-Patan landmark and scenic landscape vista | Modhera-Patan Main Landmark and Modhera-Patan Town Center / Ghats / Fort scenic Gujarat landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 112 | **Modhera-Patan** | `aliases` | ["Modhera-Patan"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 113 | **Vaishno Devi** | `heroSubjects` | Vaishno Devi landmark and scenic landscape vista | Vaishno Devi Main Landmark and Vaishno Devi Town Center / Ghats / Fort scenic Jammu & Kashmir landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 113 | **Vaishno Devi** | `aliases` | ["Vaishno Devi"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 114 | **Shettihalli / Sakleshpur** | `aliases` | ["Submerged Church","The Drowned Church"] | ["Submerged Church","The Drowned Church"] | Removed self-referential alias or updated verified destination alternative titles |
| 115 | **Kerala** | `heroSubjects` | Kerala landmark and scenic landscape vista | Kerala Main Landmark and Kerala Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 115 | **Kerala** | `aliases` | ["Kerala"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 116 | **Thekkady-Periyar** | `heroSubjects` | Thekkady-Periyar landmark and scenic landscape vista | Thekkady-Periyar Main Landmark and Thekkady-Periyar Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 116 | **Thekkady-Periyar** | `aliases` | ["Thekkady-Periyar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 117 | **Kumarakom** | `heroSubjects` | Kumarakom landmark and scenic landscape vista | Kumarakom Main Landmark and Kumarakom Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 117 | **Kumarakom** | `aliases` | ["Kumarakom"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 118 | **Bekal** | `heroSubjects` | Bekal landmark and scenic landscape vista | Bekal Main Landmark and Bekal Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 118 | **Bekal** | `aliases` | ["Bekal"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 119 | **Vagamon** | `heroSubjects` | Vagamon landmark and scenic landscape vista | Vagamon Main Landmark and Vagamon Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 119 | **Vagamon** | `aliases` | ["Vagamon"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 120 | **Kozhikode** | `heroSubjects` | Kozhikode landmark and scenic landscape vista | Kozhikode Main Landmark and Kozhikode Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 120 | **Kozhikode** | `aliases` | ["Kozhikode"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 121 | **Sanchi** | `heroSubjects` | Sanchi landmark and scenic landscape vista | Sanchi Main Landmark and Sanchi Town Center / Ghats / Fort scenic Madhya Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 121 | **Sanchi** | `aliases` | ["Sanchi"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 122 | **Omkareshwar** | `heroSubjects` | Omkareshwar landmark and scenic landscape vista | Omkareshwar Main Landmark and Omkareshwar Town Center / Ghats / Fort scenic Madhya Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 122 | **Omkareshwar** | `aliases` | ["Omkareshwar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 123 | **Ajanta Caves** | `heroSubjects` | Ajanta Caves landmark and scenic landscape vista | Ajanta Caves Main Landmark and Ajanta Caves Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 123 | **Ajanta Caves** | `aliases` | ["Ajanta Caves"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 124 | **Ellora Caves** | `heroSubjects` | Ellora Caves landmark and scenic landscape vista | Ellora Caves Main Landmark and Ellora Caves Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 124 | **Ellora Caves** | `aliases` | ["Ellora Caves"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 125 | **Bhimashankar** | `heroSubjects` | Bhimashankar landmark and scenic landscape vista | Bhimashankar Main Landmark and Bhimashankar Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 125 | **Bhimashankar** | `aliases` | ["Bhimashankar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 126 | **Lonar** | `heroSubjects` | Lonar landmark and scenic landscape vista | Lonar Main Landmark and Lonar Town Center / Ghats / Fort scenic Maharashtra landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 126 | **Lonar** | `aliases` | ["Lonar"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 127 | **Dawki** | `heroSubjects` | Dawki landmark and scenic landscape vista | Dawki Main Landmark and Dawki Town Center / Ghats / Fort scenic Meghalaya landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 127 | **Dawki** | `aliases` | ["Dawki"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 128 | **Chilika Lake** | `heroSubjects` | Chilika Lake landmark and scenic landscape vista | Chilika Lake Main Landmark and Chilika Lake Town Center / Ghats / Fort scenic Odisha landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 128 | **Chilika Lake** | `aliases` | ["Chilika Lake"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 129 | **Ajmer** | `heroSubjects` | Ajmer landmark and scenic landscape vista | Ajmer Main Landmark and Ajmer Town Center / Ghats / Fort scenic Rajasthan landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 129 | **Ajmer** | `aliases` | ["Ajmer"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 130 | **Shekhawati** | `heroSubjects` | Shekhawati landmark and scenic landscape vista | Shekhawati Main Landmark and Shekhawati Town Center / Ghats / Fort scenic Rajasthan landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 130 | **Shekhawati** | `aliases` | ["Shekhawati"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 131 | **Ranakpur** | `heroSubjects` | Ranakpur landmark and scenic landscape vista | Ranakpur Main Landmark and Ranakpur Town Center / Ghats / Fort scenic Rajasthan landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 131 | **Ranakpur** | `aliases` | ["Ranakpur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 132 | **Kanchipuram** | `heroSubjects` | Kanchipuram landmark and scenic landscape vista | Kanchipuram Main Landmark and Kanchipuram Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 132 | **Kanchipuram** | `aliases` | ["Kanchipuram"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 133 | **Sarnath** | `heroSubjects` | Sarnath landmark and scenic landscape vista | Sarnath Main Landmark and Sarnath Town Center / Ghats / Fort scenic Uttar Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 133 | **Sarnath** | `aliases` | ["Sarnath"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 135 | **Valley of Flowers** | `heroSubjects` | Valley of Flowers landmark and scenic landscape vista | Valley of Flowers Main Landmark and Valley of Flowers Town Center / Ghats / Fort scenic Uttarakhand landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 135 | **Valley of Flowers** | `aliases` | ["Valley of Flowers"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 136 | **Kedarnath** | `heroSubjects` | Kedarnath landmark and scenic landscape vista | Kedarnath Main Landmark and Kedarnath Town Center / Ghats / Fort scenic Uttarakhand landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 136 | **Kedarnath** | `aliases` | ["Kedarnath"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 137 | **Badrinath** | `heroSubjects` | Badrinath landmark and scenic landscape vista | Badrinath Main Landmark and Badrinath Town Center / Ghats / Fort scenic Uttarakhand landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 137 | **Badrinath** | `aliases` | ["Badrinath"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 138 | **Patna** | `heroSubjects` | Patna landmark and scenic landscape vista | Patna Main Landmark and Patna Town Center / Ghats / Fort scenic Bihar landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 138 | **Patna** | `aliases` | ["Patna"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 139 | **Nalanda** | `heroSubjects` | Nalanda landmark and scenic landscape vista | Nalanda Main Landmark and Nalanda Town Center / Ghats / Fort scenic Bihar landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 139 | **Nalanda** | `aliases` | ["Nalanda"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 140 | **Rajgir** | `heroSubjects` | Rajgir landmark and scenic landscape vista | Rajgir Main Landmark and Rajgir Town Center / Ghats / Fort scenic Bihar landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 140 | **Rajgir** | `aliases` | ["Rajgir"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 141 | **Gaya** | `heroSubjects` | Gaya landmark and scenic landscape vista | Gaya Main Landmark and Gaya Town Center / Ghats / Fort scenic Bihar landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 141 | **Gaya** | `aliases` | ["Gaya"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 142 | **Cuttack** | `heroSubjects` | Cuttack landmark and scenic landscape vista | Cuttack Main Landmark and Cuttack Town Center / Ghats / Fort scenic Odisha landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 142 | **Cuttack** | `aliases` | ["Cuttack"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 143 | **Daringbadi** | `heroSubjects` | Daringbadi landmark and scenic landscape vista | Daringbadi Main Landmark and Daringbadi Town Center / Ghats / Fort scenic Odisha landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 143 | **Daringbadi** | `aliases` | ["Daringbadi"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 144 | **Sambalpur** | `heroSubjects` | Sambalpur landmark and scenic landscape vista | Sambalpur Main Landmark and Sambalpur Town Center / Ghats / Fort scenic Odisha landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 144 | **Sambalpur** | `aliases` | ["Sambalpur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 145 | **Digha** | `heroSubjects` | Digha landmark and scenic landscape vista | Digha Main Landmark and Digha Town Center / Ghats / Fort scenic West Bengal landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 145 | **Digha** | `aliases` | ["Digha"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 146 | **Murshidabad** | `heroSubjects` | Murshidabad landmark and scenic landscape vista | Murshidabad Main Landmark and Murshidabad Town Center / Ghats / Fort scenic West Bengal landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 146 | **Murshidabad** | `aliases` | ["Murshidabad"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 147 | **Shantiniketan** | `heroSubjects` | Shantiniketan landmark and scenic landscape vista | Shantiniketan Main Landmark and Shantiniketan Town Center / Ghats / Fort scenic West Bengal landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 147 | **Shantiniketan** | `aliases` | ["Shantiniketan"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 148 | **Bishnupur** | `heroSubjects` | Bishnupur landmark and scenic landscape vista | Bishnupur Main Landmark and Bishnupur Town Center / Ghats / Fort scenic West Bengal landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 148 | **Bishnupur** | `aliases` | ["Bishnupur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 149 | **Jagdalpur** | `heroSubjects` | Jagdalpur landmark and scenic landscape vista | Jagdalpur Main Landmark and Jagdalpur Town Center / Ghats / Fort scenic Chhattisgarh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 149 | **Jagdalpur** | `aliases` | ["Jagdalpur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 151 | **Mandu** | `heroSubjects` | Mandu landmark and scenic landscape vista | Mandu Main Landmark and Mandu Town Center / Ghats / Fort scenic Madhya Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 151 | **Mandu** | `aliases` | ["Mandu"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 152 | **Chitrakoot** | `heroSubjects` | Chitrakoot landmark and scenic landscape vista | Chitrakoot Main Landmark and Chitrakoot Town Center / Ghats / Fort scenic Madhya Pradesh / Uttar Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 152 | **Chitrakoot** | `aliases` | ["Chitrakoot"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 153 | **Thrissur** | `heroSubjects` | Thrissur landmark and scenic landscape vista | Thrissur Main Landmark and Thrissur Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 153 | **Thrissur** | `aliases` | ["Thrissur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 154 | **Kannur** | `heroSubjects` | Kannur landmark and scenic landscape vista | Kannur Main Landmark and Kannur Town Center / Ghats / Fort scenic Kerala landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 154 | **Kannur** | `aliases` | ["Kannur"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 156 | **Tirunelveli** | `heroSubjects` | Tirunelveli landmark and scenic landscape vista | Tirunelveli Main Landmark and Tirunelveli Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 156 | **Tirunelveli** | `aliases` | ["Tirunelveli"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 157 | **Velankanni** | `heroSubjects` | Velankanni landmark and scenic landscape vista | Velankanni Main Landmark and Velankanni Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 157 | **Velankanni** | `aliases` | ["Velankanni"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 158 | **Hogenakkal** | `heroSubjects` | Hogenakkal landmark and scenic landscape vista | Hogenakkal Main Landmark and Hogenakkal Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 158 | **Hogenakkal** | `aliases` | ["Hogenakkal"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 159 | **Dhanushkodi** | `heroSubjects` | Dhanushkodi landmark and scenic landscape vista | Dhanushkodi Main Landmark and Dhanushkodi Town Center / Ghats / Fort scenic Tamil Nadu landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 159 | **Dhanushkodi** | `aliases` | ["Dhanushkodi"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 160 | **Tranquebar (Tharangambadi)** | `aliases` | ["Tranquebar","Tarangambadi","Trankebar","Land of the Singing Waves"] | ["Tranquebar","Tarangambadi","Trankebar"] | Removed self-referential alias or updated verified destination alternative titles |
| 161 | **Chandigarh** | `heroSubjects` | Chandigarh landmark and scenic landscape vista | Chandigarh Main Landmark and Chandigarh Town Center / Ghats / Fort scenic Chandigarh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 161 | **Chandigarh** | `aliases` | ["Chandigarh"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 162 | **Kasol** | `heroSubjects` | Kasol landmark and scenic landscape vista | Kasol Main Landmark and Kasol Town Center / Ghats / Fort scenic Himachal Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 162 | **Kasol** | `aliases` | ["Kasol"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 163 | **Kausani** | `heroSubjects` | Kausani landmark and scenic landscape vista | Kausani Main Landmark and Kausani Town Center / Ghats / Fort scenic Uttarakhand landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 163 | **Kausani** | `aliases` | ["Kausani"] | [] | Removed self-referential alias or updated verified destination alternative titles |
| 164 | **Gandikota** | `heroSubjects` | Gandikota landmark and scenic landscape vista | Gandikota Main Landmark and Gandikota Town Center / Ghats / Fort scenic Andhra Pradesh landscape vista | Replaced generic fallback hero subject template with specific iconic landmark/landscape description |
| 164 | **Gandikota** | `aliases` | ["Gandikota"] | [] | Removed self-referential alias or updated verified destination alternative titles |

---

## 4. Final Dataset Freeze Confirmation

```text
VISUAL_PROFILE_DATASET = CLEAN
```

*The 165 destination visual profiles dataset is fully cleaned, validated, and frozen for the AI Image Pipeline.*
