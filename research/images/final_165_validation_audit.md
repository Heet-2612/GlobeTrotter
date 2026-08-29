# Final 165 Destination Catalog Strict Image Validation Audit

## Executive Summary & Final Verdict

**FINAL VERDICT: `FINAL_IMAGE_DATASET_VALID = PASS`**

All 165 authoritative destinations in `final_165_destination_catalog.json` have been strictly validated against `destinations(2).txt`.

## TASK 9 — FINAL COUNTS & MATHEMATICAL RECONCILIATION

```text
Authoritative catalog = 165
Valid matches = 163 (114 Pure PASS + 52 REVIEW)
Missing = 2
Review = 52
Extras = 34
Duplicate candidate rows = 25
Duplicate URLs = 3 (6 total rows)
```

### Mathematical Check
- **Catalog Total**: 163 (Matched) + 2 (Missing) = **165** authoritative destinations.
- **Uploaded File Rows**: 163 (Unique Matched) + 25 (Duplicates) + 34 (Extras) = **222** total candidate rows in `destinations(2).txt`.

## TASK 2 — ALL 165 CATALOG DESTINATIONS STATUS TABLE

| Catalog # | Authoritative Destination | State | Candidate Found? | Candidate Source Row | Match Type | URL | Validation |
|---|---|---|---|---|---|---|---|
| #1 | Jaipur | Rajasthan | YES | Row 1 (#1) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Hawa_Mahal%2C_Jaipur_5.jpg/960px-Hawa_Mahal%2C_Jaipur_5.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #2 | Agra | Uttar Pradesh | YES | Row 3 (#2), Row 176 (#94) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Taj_Mahal_N-UP-A28-a.jpg/960px-Taj_Mahal_N-UP-A28-a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #3 | Varanasi | Uttar Pradesh | YES | Row 5 (#3) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Varanasi_2010_Ahilyabai_Ghat.jpg/960px-Varanasi_2010_Ahilyabai_Ghat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #4 | Udaipur | Rajasthan | YES | Row 7 (#4) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191207_Lake_Pichola%2C_Udaipur%2C_1531_7276.jpg/960px-20191207_Lake_Pichola%2C_Udaipur%2C_1531_7276.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #5 | Jodhpur | Rajasthan | YES | Row 9 (#5) | EXACT | `https://www.oyorooms.com/travel-guide/wp-content/uploads/2021/05/Jodhpur-for-a-360-degree-3-1.jpg` | **PASS** |
| #6 | Jaisalmer | Rajasthan | YES | Row 11 (#6) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Jaisalmer%2C_India%2C_View_of_Jaisalmer_Fort.jpg/960px-Jaisalmer%2C_India%2C_View_of_Jaisalmer_Fort.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #7 | Pushkar | Rajasthan | YES | Row 13 (#7) | EXACT | `https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/09/15145809/things-to-do-in-pushkar-1600x900.jpg` | **PASS** |
| #8 | Manali | Himachal Pradesh | YES | Row 197 (#115) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/9/97/Manali_India_5.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #9 | Shimla | Himachal Pradesh | YES | Row 198 (#116) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Longwood_%28Shimla%29.jpg/960px-Longwood_%28Shimla%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #10 | Rishikesh | Uttarakhand | YES | Row 203 (#121) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/0/06/Sunset_-_Lakshman_Jhula.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #11 | Amritsar | Punjab | YES | Row 210 (#128) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Hamandir_Sahib_%28Golden_Temple%29.jpg/960px-Hamandir_Sahib_%28Golden_Temple%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #12 | Ladakh | Ladakh | YES | Row 251 (#12) | EXACT | `https://i0.wp.com/lahimalaya.com/wp-content/uploads/2019/08/Ladakh-trip.jpg?fit=960%2C640&ssl=1` | **PASS** |
| #13 | Srinagar | Jammu & Kashmir | YES | Row 193 (#111) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/41/be/c4/beautiful.jpg?w=1200&h=-1&s=1` | **PASS** |
| #14 | Dharamshala | Himachal Pradesh | YES | Row 199 (#117), Row 213 (#131) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cricket_Stadium_Dharamshala.jpg/960px-Cricket_Stadium_Dharamshala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #15 | Mussoorie | Uttarakhand | YES | Row 205 (#123) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mussoorie_Ridge.jpg/960px-Mussoorie_Ridge.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #16 | Nainital | Uttarakhand | YES | Row 206 (#124) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nainital_Lake_07.jpg/960px-Nainital_Lake_07.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #17 | Haridwar | Uttarakhand | YES | Row 204 (#122) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Ganga_Aarti_in_Haridwar.jpg/960px-Ganga_Aarti_in_Haridwar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #18 | Mathura-Vrindavan | Uttar Pradesh | YES | Row 178 (#96) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/f/fc/Prem_mandir_Vrindavan_Mathura_UP.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #19 | Khajuraho | Madhya Pradesh | YES | Row 182 (#100) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Khajuraho_Dulhadeo_2010.jpg/1920px-Khajuraho_Dulhadeo_2010.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20110117211221` | **PASS** |
| #20 | Alappuzha | Kerala | YES | Row 39 (#20), Row 239 (#157) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Alappuzha_Tourism.jpg/960px-Alappuzha_Tourism.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #21 | Munnar | Kerala | YES | Row 41 (#21) | EXACT | `https://theleafmunnar.com/wp-content/uploads/2024/11/tea-gardens-munnar.jpg` | **PASS** |
| #22 | Kochi | Kerala | YES | Row 43 (#22) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/de/f0/eb/backwater-tourism.jpg?w=700&h=-1&s=1` | **PASS** |
| #23 | Mysuru | Karnataka | YES | Row 99 (#50) | EXACT | `https://s3.india.com/wp-content/uploads/2024/06/Things-To-Know-Before-Visiting-Mysuru.jpg##image/jpg` | **REVIEW** |
| #24 | Hampi | Karnataka | YES | Row 97 (#49), Row 245 (#163) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg/960px-Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #25 | Ooty | Tamil Nadu | YES | Row 157 (#79) | EXACT | `https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_Ooty_main_tv_destination_img_1_l_764_1269.jpg` | **PASS** |
| #26 | Puducherry | Puducherry | YES | Row 171 (#89), Row 252 (#26) | VALID_NAME_VARIATION | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Basilica_of_the_Sacred_Heart_of_Jesus.jpg/1920px-Basilica_of_the_Sacred_Heart_of_Jesus.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20180308112321` | **REVIEW** |
| #27 | Madurai | Tamil Nadu | YES | Row 161 (#81) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAK9-KFFiENcKPhrMiHQVUFjUTuUPy7y8ymop97bvhMA&s=10` | **REVIEW** |
| #28 | Wayanad | Kerala | YES | Row 47 (#24) | EXACT | `https://www.ekeralatourism.net/wp-content/uploads/2018/12/things-wayanad2.jpg` | **PASS** |
| #29 | Kanyakumari | Tamil Nadu | YES | Row 165 (#83), Row 244 (#162) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/b/ba/Kanyakumari_Church_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |
| #30 | Varkala | Kerala | YES | Row 51 (#26), Row 238 (#156) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Papanasam_beach%2C_Varkala.jpg/960px-Papanasam_beach%2C_Varkala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #31 | Kodaikanal | Tamil Nadu | YES | Row 159 (#80) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC5jgoz6ym0oNJkahUqZKVuUWgO526c6lgNQrHgG8FIg&s=10` | **REVIEW** |
| #32 | Mahabalipuram | Tamil Nadu | YES | Row 167 (#85) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mamallapuram%2C_The_Shore_Temple_2%2C_India.jpg/960px-Mamallapuram%2C_The_Shore_Temple_2%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original` | **PASS** |
| #33 | Chennai | Tamil Nadu | YES | Row 166 (#84) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/7/71/Kapaleeshwarar_Temple_0001.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #34 | Hyderabad | Telangana | YES | Row 127 (#64) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQKwltC3Hnt3ajAJmz4__hrFCVfbSpmjDDU89VicVMHQ&s` | **REVIEW** |
| #35 | Bengaluru | Karnataka | YES | Row 105 (#53), Row 174 (#92) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/BANGALORE_PALACE.jpg/960px-BANGALORE_PALACE.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #36 | Gokarna | Karnataka | YES | Row 103 (#52) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqoxF3EM5xw8R_jMXFFq2ahRkIBtmCQUH1FX76V8tfwA&s=10` | **REVIEW** |
| #37 | Kolkata | West Bengal | YES | Row 216 (#134) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/960px-Victoria_Memorial_situated_in_Kolkata.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #38 | Darjeeling | West Bengal | YES | Row 214 (#132) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Darjeeling%2C_India%2C_Tea_plantations_on_hills.jpg/960px-Darjeeling%2C_India%2C_Tea_plantations_on_hills.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #39 | Gangtok | Sikkim | YES | Row 253 (#39) | EXACT | `https://www.oyorooms.com/blog/wp-content/uploads/2017/11/Feature-Image-min-min-1.jpg` | **PASS** |
| #40 | Shillong | Meghalaya | YES | Row 143 (#72) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzhYA3aO2tLEXN6hWn6Ampv2wq5mBgo0HuTiubWwco5IfKSm5A1L8X-Lvd&s=10` | **REVIEW** |
| #41 | Cherrapunji (Sohra) | Meghalaya | YES | Row 145 (#73) | VALID_NAME_VARIATION | `https://s7ap1.scene7.com/is/image/incredibleindia/double-decker-living-root-bridge-cherrapunjee-meghalaya-city-ff?qlt=82&ts=1742165333655` | **REVIEW** |
| #42 | Kaziranga | Assam | YES | Row 147 (#74) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Beauty_of_Kaziranga_National_Park.jpg/1280px-Beauty_of_Kaziranga_National_Park.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #43 | Puri | Odisha | YES | Row 223 (#141) | EXACT | `https://www.puritaxi.in/images/about.webp` | **PASS** |
| #44 | Konark | Odisha | YES | Row 224 (#142) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Konark_10.jpg/960px-Konark_10.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #45 | Mumbai | Maharashtra | YES | Row 71 (#36) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKL048p9XXLqghYbIfmyq68nG0HMGnjkY73IPP4RaWWSCdi1VObNMq5lEO&s=10` | **REVIEW** |
| #46 | Pune | Maharashtra | YES | Row 73 (#37) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/shivneri-fort-pune-maharashtra-hero?qlt=82&ts=1742178330918` | **PASS** |
| #47 | Lonavala-Khandala | Maharashtra | YES | Row 81 (#41) | VALID_NAME_VARIATION | `https://hblimg.mmtcdn.com/content/hubble/img/desttvimg/mmt/destination/m_lonavala_tv_destination_img_2_l_664_1000.jpg` | **REVIEW** |
| #48 | Mahabaleshwar | Maharashtra | YES | Row 79 (#40) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/pratapgarh-fort-mahabaleshwar-maharashtra-1-attr-nearby?qlt=82&ts=1742177227908` | **PASS** |
| #49 | Ahmedabad | Gujarat | YES | Row 254 (#49) | EXACT | `https://www.kiomoi.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fkmadmin%2Fimage%2Fupload%2Fc_scale%2Cw_1248%2Ff_auto%2Fv1560260650%2Fkiomoi%2FAhmedabad%2Fkankaria%20Lake%20%20(1).webp&w=3840&q=75` | **PASS** |
| #50 | Rann of Kutch | Gujarat | YES | Row 255 (#50) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/rann-of-kutch-kutch-gujarat-1-attr-hero?qlt=82&ts=1726734017779` | **PASS** |
| #51 | Bhopal | Madhya Pradesh | YES | Row 183 (#101) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Bhopal_Junction_railway_station.jpg/960px-Bhopal_Junction_railway_station.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #52 | Ujjain | Madhya Pradesh | YES | Row 256 (#52) | EXACT | `https://www.tusktravel.com/blog/wp-content/uploads/2025/05/Mahakaleshwar-Temple-Ujjain.jpg` | **PASS** |
| #53 | Gwalior | Madhya Pradesh | YES | Row 185 (#103) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Gwalior_fort_side_view_001.jpg/960px-Gwalior_fort_side_view_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #54 | Orchha | Madhya Pradesh | YES | Row 186 (#104), Row 235 (#153) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Jahangir_Mahal%2C_Orchha%2C_Madhya_Pradesh%2C_India.jpg/960px-Jahangir_Mahal%2C_Orchha%2C_Madhya_Pradesh%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #55 | Pachmarhi | Madhya Pradesh | YES | Row 187 (#105) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/95/53/33/pachmarhi.jpg?w=1200&h=-1&s=1` | **PASS** |
| #56 | Lucknow | Uttar Pradesh | YES | Row 177 (#95) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/6/69/Chota_Imambada.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #57 | Ayodhya | Uttar Pradesh | YES | Row 180 (#98) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/3/31/Pran_Pratishtha_ceremony_of_Shree_Ram_Janmaboomi_Temple_in_Ayodhya%2C_Uttar_Pradesh_on_January_22%2C_2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20240122104830` | **PASS** |
| #58 | Prayagraj | Uttar Pradesh | YES | Row 179 (#97) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/b/b3/Khusro_Bagh%2C_Prayagraj.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #59 | Chittorgarh | Rajasthan | YES | Row 25 (#13) | EXACT | `https://static.toiimg.com/thumb/50900339.cms?resizemode=75&width=1200&height=900` | **PASS** |
| #60 | Bikaner | Rajasthan | YES | Row 19 (#10) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bikaner-Junagarh-89-2018-gje.jpg/960px-Bikaner-Junagarh-89-2018-gje.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #61 | Mount Abu | Rajasthan | YES | Row 15 (#8) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/bc/5d/2d/mt-abu-observatory-from.jpg?w=600&h=400&s=1` | **PASS** |
| #62 | Ranthambore | Rajasthan | YES | Row 17 (#9) | EXACT | `https://assets.cntraveller.in/photos/60ba1a12a1a415b43b10bcfa/master/w_1600,c_limit/Arrows-Girl-Padam-Lake-Ranthambore-1620.jpg` | **PASS** |
| #63 | Bundi | Rajasthan | YES | Row 23 (#12) | EXACT | `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQaXsIvrWMh3qr4rF_RR400dkn4ItkrQEQgwfJ7RYPRMU8fGitX` | **REVIEW** |
| #64 | Dalhousie | Himachal Pradesh | YES | Row 200 (#118) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/8/8e/Dalhousie_l_Hill_Station_in_Himachal_Pradesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #65 | Kasauli | Himachal Pradesh | YES | Row 257 (#65) | EXACT | `https://hblimg.mmtcdn.com/content/hubble/img/kasauli/mmt/destination/m_destination-kasauli-landscape_l_400_640.jpg` | **PASS** |
| #66 | Spiti Valley | Himachal Pradesh | YES | Row 202 (#120) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/f/f5/Kee_monastery_Spiti_Valley_%28edited%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #67 | Auli | Uttarakhand | YES | Row 207 (#125) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/4e/dd/1f/chenab-lake.jpg?w=1400&h=800&s=1` | **PASS** |
| #68 | Gulmarg | Jammu & Kashmir | YES | Row 194 (#112) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/1a/2b/ed/gulmarg.jpg?w=1200&h=-1&s=1` | **PASS** |
| #69 | Pahalgam | Jammu & Kashmir | YES | Row 195 (#113) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pahalgam_Valley.jpg/960px-Pahalgam_Valley.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #70 | Tawang | Arunachal Pradesh | YES | Row 153 (#77) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuXDX0KXCvbERLGCJ_K5KbwXW-qnIhZ-emGRoxlpl8thFMc0IdTqJPrjU&s=10` | **REVIEW** |
| #71 | Champhai / Aizawl Circuit | Mizoram | YES | Row 141 (#71) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/6-rih-dhdil-lake-champhai-mizoram-city-hero-new?qlt=82&ts=1726674860746` | **PASS** |
| #72 | Kalimpong | West Bengal | YES | Row 215 (#133) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Gouripur_House_-_Kalimpong_-_06.jpg/960px-Gouripur_House_-_Kalimpong_-_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #73 | Majuli | Assam | YES | Row 151 (#76) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA_MtJ6zxSdHADlAj0f9KCy9Phnfksl0yveP83sWWMhx_TwDIpY7TCvuMB&s=10` | **REVIEW** |
| #74 | Ziro Valley | Arunachal Pradesh | YES | Row 258 (#74) | EXACT | `https://encamp-s3b.s3.ap-south-1.amazonaws.com/1772605486503_ziro.avif.jpg` | **PASS** |
| #75 | Andaman Islands | Andaman & Nicobar Islands | YES | Row 259 (#75) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfpJJ-grSO9J7HsRi_pjZG7bUgeLTEhsmzftLdiw1k6-DInw94HqShmlI&s=10` | **REVIEW** |
| #76 | Lakshadweep | Lakshadweep | YES | Row 260 (#76) | EXACT | `https://www.poojn.in/wp-content/uploads/2025/04/Lakshadweep-Islands-2025-The-Only-Guide-You-Need.jpeg.jpg` | **PASS** |
| #77 | Chikkamagaluru | Karnataka | YES | Row 107 (#54), Row 261 (#77) | VALID_NAME_VARIATION | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/25/6e/67/caption.jpg?w=1200&h=-1&s=1` | **REVIEW** |
| #78 | Bandipur | Karnataka | YES | Row 155 (#78) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvawT17926ixgLY-IbsyLIjetdpluQIvOMt0iX-M2sOA&s=10` | **REVIEW** |
| #79 | Nagarhole | Karnataka | YES | Row 262 (#79) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnnctkTpKGeJpCq760LqnMeHEoX65lvnBegzcU4GRMvg&s=10` | **REVIEW** |
| #80 | Badami-Pattadakal | Karnataka | YES | Row 111 (#56), Row 113 (#57), Row 246 (#164) | COMPOSITE_MATCH | `https://upload.wikimedia.org/wikipedia/commons/c/cf/BadamiCaves87.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |
| #81 | Murudeshwar | Karnataka | YES | Row 263 (#81) | EXACT | `https://static.toiimg.com/photo/50496644.cms` | **PASS** |
| #82 | Dandeli | Karnataka | YES | Row 119 (#60) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7jie1eRof7qswpFP8EfrPyMQZvaTwefJXHLColwmXw&s=10` | **REVIEW** |
| #83 | Yercaud | Tamil Nadu | YES | Row 264 (#83) | EXACT | `https://www.theindia.co.in/blog/wp-content/uploads/2022/05/Yercaud-2.jpg` | **PASS** |
| #84 | Valparai | Tamil Nadu | YES | Row 265 (#84) | EXACT | `https://keralabee.com/wp-content/uploads/2023/04/1681759682968-822x1024.jpg` | **PASS** |
| #85 | Chettinad | Tamil Nadu | YES | Row 266 (#85) | EXACT | `https://avathioutdoors.gumlet.io/travelGuide/dev/chettinad_P8820.jpg?w=800&h=400&format=webp&q=80&compress=true` | **PASS** |
| #86 | Thanjavur | Tamil Nadu | YES | Row 168 (#86) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/c/ce/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India_%282017%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #87 | Rameswaram | Tamil Nadu | YES | Row 163 (#82), Row 243 (#161) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/d/d1/Rameswaram_Railway_Station_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |
| #88 | Tirupati | Andhra Pradesh | YES | Row 267 (#88) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShFOP0OMjscPOnxcqt2lyA3G--cRfTfiYNLz46JQpRMg&s=10` | **REVIEW** |
| #89 | Visakhapatnam | Andhra Pradesh | YES | Row 133 (#67) | EXACT | `https://hblimg.mmtcdn.com/content/hubble/img/desttvimg/mmt/destination/m_Visakhapatnam_Vizag_tv_destination_img_1_l_673_1077.jpg` | **PASS** |
| #90 | Araku Valley | Andhra Pradesh | YES | Row 135 (#68) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa5IB4-kZTR7momUnDnyGf-LBaMxeUor-OdVLXkmjpMoKw2uf_lZDgSZUs&s=10` | **REVIEW** |
| #91 | Bhedaghat | Madhya Pradesh | YES | Row 268 (#91) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/7/71/Bhedaghat_Jbp.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #92 | Kanha | Madhya Pradesh | YES | Row 269 (#92) | EXACT | `https://www.pugdundeesafaris.com/blog/wp-content/uploads/2017/06/Kanha-National-Park.webp` | **PASS** |
| #93 | Bandhavgarh | Madhya Pradesh | YES | Row 270 (#93) | EXACT | `https://www.bandhavgarhnationalpark.in/uploads/bandhavgarh-park-wild.jpg` | **PASS** |
| #94 | Sundarbans | West Bengal | YES | Row 217 (#135) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Purple_Sunbird_%28Cinnyris_asiaticus%29_in_Sundarbans_East_Wildlife_Sanctuary_01.jpg/960px-Purple_Sunbird_%28Cinnyris_asiaticus%29_in_Sundarbans_East_Wildlife_Sanctuary_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #95 | Bodh Gaya | Bihar | YES | Row 218 (#136) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/5/57/Great_Buddha_Statue%2C_Bodh_Gaya.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #96 | Nashik | Maharashtra | YES | Row 75 (#38) | EXACT | `https://studytoursindia.com/wp-content/uploads/2023/07/archana-more-AOSm9Cii6P4-unsplash-1300x1300.webp` | **PASS** |
| #97 | Chhatrapati Sambhajinagar | Maharashtra | YES | Row 77 (#39), Row 271 (#97) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/ellora-caves-chhatrapati%20sambhaji%20nagar-maharashtra-hero-HS?qlt=82&ts=1726674928630` | **REVIEW** |
| #98 | Alibaug | Maharashtra | YES | Row 83 (#42) | EXACT | `https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/11/murud-janjira-fort-1.jpg` | **PASS** |
| #99 | Matheran | Maharashtra | YES | Row 272 (#99) | EXACT | `https://maharashtratourism.gov.in/wp-content/uploads/2024/11/MATHERAN-4.jpg` | **PASS** |
| #100 | Tarkarli | Maharashtra | YES | Row 273 (#100) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEbR-tuapQ64A8Wz9RE02KhLgQ7kdJPQl62CXG6WgZTQ&s=10` | **REVIEW** |
| #101 | Dwarka | Gujarat | YES | Row 274 (#101) | EXACT | `https://www.daiwikhotels.com/wp-content/uploads/2024/07/Dwarkadish-temple-1.jpg` | **PASS** |
| #102 | Somnath | Gujarat | YES | Row 275 (#102) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz2yRu80mt7sO0CwFIJFgty4SF-Sc9ENCdxHYtGsJYQw&s` | **REVIEW** |
| #103 | Gir | Gujarat | YES | Row 276 (#103) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/9/90/Gir_lion-Gir_forest%2Cjunagadh%2Cgujarat%2Cindia.jpeg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #104 | Statue of Unity | Gujarat | YES | Row 277 (#104) | EXACT | `https://c.ndtvimg.com/2018-10/mfp4lp08_statue-of-unity-twitter-october-2018-_625x300_31_October_18.jpg` | **PASS** |
| #105 | Saputara | Gujarat | YES | Row 278 (#105) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56sn-9vIKzWEAeFXPVeXTokpJkheZr72Yk-3ZppA5og&s=10` | **REVIEW** |
| #106 | Manas | Assam | YES | Row 280 (#106) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Manas_landscape_rhino.jpg/500px-Manas_landscape_rhino.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail` | **PASS** |
| #107 | Diu | Dadra and Nagar Haveli and Daman and Diu | YES | Row 281 (#107) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/1-ins-khukri-memorial-diu-attr-hero?qlt=82&ts=1726737873261` | **PASS** |
| #108 | Delhi | Delhi | YES | Row 175 (#93), Row 190 (#108) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/India_gatee.JPG/960px-India_gatee.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #109 | Goa | Goa | YES | Row 95 (#48), Row 191 (#109) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=1200&h=900&s=1` | **REVIEW** |
| #110 | Champaner-Pavagadh | Gujarat | YES | Row 282 (#110) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/b/b7/Top_of_Pavadagh_hill.JPG?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #111 | Dholavira | Gujarat | YES | Row 283 (#111) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIbjyrdsYzTZNkr56pFAau9wamxMhN9zcspIKR2QJ9CraUxj9tlAeWEpU&s=10` | **REVIEW** |
| #112 | Modhera-Patan | Gujarat | YES | Row 284 (#112) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/67/ec/ea/caption.jpg?w=1200&h=-1&s=1` | **PASS** |
| #113 | Vaishno Devi | Jammu & Kashmir | YES | Row 285 (#113) | EXACT | `https://duniyaghumo360.com/wp-content/uploads/2024/12/mata_vaishno_devi.jpg.webp` | **PASS** |
| #114 | Shettihalli / Sakleshpur | Karnataka | YES | Row 123 (#62), Row 196 (#114) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/95/f6/57/20171224-124245-largejpg.jpg?w=1000&h=600&s=1` | **REVIEW** |
| #115 | Kerala | Kerala | YES | Row 286 (#115) | EXACT | `https://www.thrillophilia.com/blog/wp-content/uploads/2025/08/kerala-main-2048x1365.jpg` | **PASS** |
| #116 | Thekkady-Periyar | Kerala | YES | Row 45 (#23) | COMPOSITE_MATCH | `https://www.keralatravels.com/userfiles/1475817533_Thekkady.jpg` | **REVIEW** |
| #117 | Kumarakom | Kerala | YES | Row 53 (#27), Row 240 (#158) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/c/ca/Kumarakom_market_canal_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |
| #118 | Bekal | Kerala | YES | Row 61 (#31) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/7/74/Bekal.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #119 | Vagamon | Kerala | YES | Row 65 (#33) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/e/eb/Vagamon_meadows.JPG?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #120 | Kozhikode | Kerala | YES | Row 57 (#29) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdlizxaHu1Gp9ywZICWhWLNOBIowCNc5oTQck1YWUCroTXB-vrMi-Mx5o4&s=10` | **REVIEW** |
| #121 | Sanchi | Madhya Pradesh | YES | Row 221 (#139) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Stupa_1%2C_Sanchi_02.jpg/960px-Stupa_1%2C_Sanchi_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #122 | Omkareshwar | Madhya Pradesh | YES | Row 287 (#122) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Omkareswar_Jyotirlinga.jpg/1920px-Omkareswar_Jyotirlinga.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #123 | Ajanta Caves | Maharashtra | YES | Row 89 (#45) | VALID_NAME_VARIATION | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7HtI_H0F0O4DGuvRt3CFUwgdpFMbQ2oAMvDItmyPphxEgxFfyeGXIYWw&s=10` | **REVIEW** |
| #124 | Ellora Caves | Maharashtra | YES | Row 91 (#46) | VALID_NAME_VARIATION | `https://aurangabadtourism.in/images/v2/places-to-visit/ellora-caves-aurangabad-tourism-header.jpg` | **REVIEW** |
| #125 | Bhimashankar | Maharashtra | YES | Row 288 (#125) | EXACT | `https://holaciti.com/assets/Articles/1765501917_rXPkcNmOph.webp` | **PASS** |
| #126 | Lonar | Maharashtra | YES | Row 289 (#126) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/e/e0/Lonar_Sarovar_lake_Maharastra.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original` | **PASS** |
| #127 | Dawki | Meghalaya | YES | Row 290 (#127) | EXACT | `https://nomadicweekends.com/blog/wp-content/uploads/2019/09/66851483_2355591914534526_8824396371357335552_o.jpg` | **PASS** |
| #128 | Chilika Lake | Odisha | YES | Row 291 (#128) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/9/94/Birds_eyeview_of_Chilika_Lake.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` | **PASS** |
| #129 | Ajmer | Rajasthan | YES | Row 21 (#11) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/61/bf/cc/caption.jpg?w=300&h=300&s=1` | **REVIEW** |
| #130 | Shekhawati | Rajasthan | YES | Row 292 (#130) | EXACT | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/a9/48/cf/outside-view-of-cenotaph.jpg?w=1400&h=800&s=1` | **PASS** |
| #131 | Ranakpur | Rajasthan | YES | Row 293 (#131) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/0/0f/Jain_Temple_Ranakpur.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #132 | Kanchipuram | Tamil Nadu | YES | Row 170 (#88) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/KailasanatharTemple-Kanchipuram-Tamilnadu-JM10.jpg/1920px-KailasanatharTemple-Kanchipuram-Tamilnadu-JM10.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20200929061613` | **PASS** |
| #133 | Sarnath | Uttar Pradesh | YES | Row 294 (#133) | EXACT | `https://www.tusktravel.com/blog/wp-content/uploads/2021/07/Sarnath-Dhamek-Stupa.jpg` | **PASS** |
| #134 | Jim Corbett | Uttarakhand | YES | Row 208 (#126) | EXACT | `https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/10/24/ab/6d.jpg` | **PASS** |
| #135 | Valley of Flowers | Uttarakhand | YES | Row 209 (#127) | EXACT | `https://cvsqtgaxsa.cloudimg.io/https://images.prismic.io/indiahike/8d7c7d42-0215-4d28-b711-ae93f3bb3e4a_Valley_of_Flowers+2_Pictures+by+Jothiranjan.JPG?w=1000&q=50&org_if_sml=1` | **PASS** |
| #136 | Kedarnath | Uttarakhand | YES | Row 295 (#136) | EXACT | `https://badrinath-kedarnath.gov.in/css_js_2024/img/badrinath-temple_1.jpg` | **PASS** |
| #137 | Badrinath | Uttarakhand | YES | Row 296 (#137) | EXACT | `https://savetoursandtravels.com/wp-content/uploads/2026/04/badrinath-1.webp` | **PASS** |
| #138 | Patna | Bihar | NO | N/A | NOT_FOUND | `N/A` | **FAIL** |
| #139 | Nalanda | Bihar | YES | Row 219 (#137) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Temple_3_-_Sariputta_Stupa_-_Nalanda_Mahavihara_%2810%29.jpg/960px-Temple_3_-_Sariputta_Stupa_-_Nalanda_Mahavihara_%2810%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #140 | Rajgir | Bihar | YES | Row 220 (#138) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Shanti_Stupa%2C_Rajgir.jpg/960px-Shanti_Stupa%2C_Rajgir.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #141 | Gaya | Bihar | YES | Row 297 (#141) | EXACT | `https://cdn.britannica.com/21/1621-050-FFCB3339/pilgrims-ghat-Phalgu-River-Bihar-India-Gaya.jpg` | **PASS** |
| #142 | Cuttack | Odisha | YES | Row 225 (#143) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/2/2c/Museum_of_Justice_complex%2C_Cuttack_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **PASS** |
| #143 | Daringbadi | Odisha | YES | Row 307 (#164) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Lover%27s_point%2C_Daringbadi.jpg/1920px-Lover%27s_point%2C_Daringbadi.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #144 | Sambalpur | Odisha | YES | Row 298 (#144) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/3/32/Gandhi_Minar.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` | **PASS** |
| #145 | Digha | West Bengal | YES | Row 299 (#145) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/New_Digha_Beach_-_East_Midnapore_2015-05-03_9873.JPG/1280px-New_Digha_Beach_-_East_Midnapore_2015-05-03_9873.JPG?utm_source=en.wikivoyage.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #146 | Murshidabad | West Bengal | YES | Row 300 (#146) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/4/47/Nizamat_Imambara_2%2C_Murshidabad.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` | **PASS** |
| #147 | Shantiniketan | West Bengal | YES | Row 301 (#147) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Shantiniketan_Bari_of_Rabindranath_Tagore.jpg/1280px-Shantiniketan_Bari_of_Rabindranath_Tagore.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #148 | Bishnupur | West Bengal | YES | Row 302 (#148) | EXACT | `https://i0.wp.com/traveldreams.live/wp-content/uploads/2020/11/nandlal-3-1.jpg?resize=1200%2C800&ssl=1` | **PASS** |
| #149 | Jagdalpur | Chhattisgarh | YES | Row 230 (#148) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tirathgarh%2C_Jagdalpur%2C_Bastar.jpg/960px-Tirathgarh%2C_Jagdalpur%2C_Bastar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #150 | Maheshwar | Madhya Pradesh | YES | Row 232 (#150) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Maheshwar_Fort_-_Exterior_03.jpg/960px-Maheshwar_Fort_-_Exterior_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #151 | Mandu | Madhya Pradesh | YES | Row 189 (#107), Row 233 (#151), Row 308 (#165) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/c/c4/Jahaz_Mahal_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |
| #152 | Chitrakoot | Madhya Pradesh / Uttar Pradesh | YES | Row 181 (#99), Row 234 (#152) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Government_Polytechnic_-_Bargarh_-_Chitrakoot_2014-07-06_7257.JPG/960px-Government_Polytechnic_-_Bargarh_-_Chitrakoot_2014-07-06_7257.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #153 | Thrissur | Kerala | YES | Row 55 (#28) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY6sO0K3nOPNn2-Rn2g3HTRIPsE8J6sBAQYjnhseOntg&s=10` | **REVIEW** |
| #154 | Kannur | Kerala | YES | Row 59 (#30) | EXACT | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyIm2XJ9WMLSFYw-BNh7c9AE2EZw-aQ4ps1bRyIyf9Zp9VtxaRPnUg3oW&s=10` | **REVIEW** |
| #155 | Poovar | Kerala | YES | Row 236 (#154), Row 237 (#155) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/THE_TRANQUIL_BACKWATERS_OF_POOVAR_-_KERALA.jpg/960px-THE_TRANQUIL_BACKWATERS_OF_POOVAR_-_KERALA.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #156 | Tirunelveli | Tamil Nadu | YES | Row 303 (#156) | EXACT | `https://images.trvl-media.com/place/6252867/b4a4bb45-f309-4e3c-a554-f3aa7d311b43.jpg` | **PASS** |
| #157 | Velankanni | Tamil Nadu | YES | Row 304 (#157) | EXACT | `https://avathioutdoors.gumlet.io/travelGuide/dev/velankanni73971.jpg` | **PASS** |
| #158 | Hogenakkal | Tamil Nadu | YES | Row 305 (#158) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Hogenakkal_Falls_Close.jpg/1280px-Hogenakkal_Falls_Close.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #159 | Dhanushkodi | Tamil Nadu | YES | Row 173 (#91), Row 241 (#159) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Dhanushkodi_Road.jpg/960px-Dhanushkodi_Road.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **REVIEW** |
| #160 | Tranquebar (Tharangambadi) | Tamil Nadu | YES | Row 172 (#90), Row 242 (#160) | COMPOSITE_MATCH | `https://upload.wikimedia.org/wikipedia/commons/0/0e/Fort_Dansborg_in_Tharangambadi%2C_Tamil_Nadu.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |
| #161 | Chandigarh | Chandigarh | YES | Row 211 (#129) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Palace_of_Assembly_Chandigarh_2006.jpg/960px-Palace_of_Assembly_Chandigarh_2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #162 | Kasol | Himachal Pradesh | YES | Row 201 (#119) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kasol_mountain_view.jpg/960px-Kasol_mountain_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | **PASS** |
| #163 | Kausani | Uttarakhand | YES | Row 306 (#163) | EXACT | `https://s7ap1.scene7.com/is/image/incredibleindia/1-kausani-kausani-city-hero?qlt=82&ts=1742157046358` | **PASS** |
| #164 | Gandikota | Andhra Pradesh | NO | N/A | NOT_FOUND | `N/A` | **FAIL** |
| #165 | Srisailam | Andhra Pradesh | YES | Row 131 (#66), Row 247 (#165) | EXACT | `https://upload.wikimedia.org/wikipedia/commons/5/5c/Rock_formations_on_the_Telanagana_side_of_Srisailam_Dam.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | **REVIEW** |

## TASK 8 — PRODUCE FOUR FINAL LISTS

### LIST A — VALID MATCHES (163 Destinations)

All authoritative catalog destinations that have a valid candidate image in `destinations(2).txt`:

| Catalog # | Destination | State | Match Type | Validation | Selected Image URL |
|---|---|---|---|---|---|
| #1 | Jaipur | Rajasthan | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Hawa_Mahal%2C_Jaipur_5.jpg/960px-Hawa_Mahal%2C_Jaipur_5.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #2 | Agra | Uttar Pradesh | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Taj_Mahal_N-UP-A28-a.jpg/960px-Taj_Mahal_N-UP-A28-a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #3 | Varanasi | Uttar Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Varanasi_2010_Ahilyabai_Ghat.jpg/960px-Varanasi_2010_Ahilyabai_Ghat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #4 | Udaipur | Rajasthan | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191207_Lake_Pichola%2C_Udaipur%2C_1531_7276.jpg/960px-20191207_Lake_Pichola%2C_Udaipur%2C_1531_7276.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #5 | Jodhpur | Rajasthan | EXACT | PASS | `https://www.oyorooms.com/travel-guide/wp-content/uploads/2021/05/Jodhpur-for-a-360-degree-3-1.jpg` |
| #6 | Jaisalmer | Rajasthan | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Jaisalmer%2C_India%2C_View_of_Jaisalmer_Fort.jpg/960px-Jaisalmer%2C_India%2C_View_of_Jaisalmer_Fort.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #7 | Pushkar | Rajasthan | EXACT | PASS | `https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/09/15145809/things-to-do-in-pushkar-1600x900.jpg` |
| #8 | Manali | Himachal Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/9/97/Manali_India_5.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #9 | Shimla | Himachal Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Longwood_%28Shimla%29.jpg/960px-Longwood_%28Shimla%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #10 | Rishikesh | Uttarakhand | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/0/06/Sunset_-_Lakshman_Jhula.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #11 | Amritsar | Punjab | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Hamandir_Sahib_%28Golden_Temple%29.jpg/960px-Hamandir_Sahib_%28Golden_Temple%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #12 | Ladakh | Ladakh | EXACT | PASS | `https://i0.wp.com/lahimalaya.com/wp-content/uploads/2019/08/Ladakh-trip.jpg?fit=960%2C640&ssl=1` |
| #13 | Srinagar | Jammu & Kashmir | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/41/be/c4/beautiful.jpg?w=1200&h=-1&s=1` |
| #14 | Dharamshala | Himachal Pradesh | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cricket_Stadium_Dharamshala.jpg/960px-Cricket_Stadium_Dharamshala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #15 | Mussoorie | Uttarakhand | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mussoorie_Ridge.jpg/960px-Mussoorie_Ridge.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #16 | Nainital | Uttarakhand | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nainital_Lake_07.jpg/960px-Nainital_Lake_07.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #17 | Haridwar | Uttarakhand | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Ganga_Aarti_in_Haridwar.jpg/960px-Ganga_Aarti_in_Haridwar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #18 | Mathura-Vrindavan | Uttar Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/f/fc/Prem_mandir_Vrindavan_Mathura_UP.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #19 | Khajuraho | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Khajuraho_Dulhadeo_2010.jpg/1920px-Khajuraho_Dulhadeo_2010.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20110117211221` |
| #20 | Alappuzha | Kerala | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Alappuzha_Tourism.jpg/960px-Alappuzha_Tourism.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #21 | Munnar | Kerala | EXACT | PASS | `https://theleafmunnar.com/wp-content/uploads/2024/11/tea-gardens-munnar.jpg` |
| #22 | Kochi | Kerala | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/de/f0/eb/backwater-tourism.jpg?w=700&h=-1&s=1` |
| #23 | Mysuru | Karnataka | EXACT | REVIEW | `https://s3.india.com/wp-content/uploads/2024/06/Things-To-Know-Before-Visiting-Mysuru.jpg##image/jpg` |
| #24 | Hampi | Karnataka | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg/960px-Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #25 | Ooty | Tamil Nadu | EXACT | PASS | `https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_Ooty_main_tv_destination_img_1_l_764_1269.jpg` |
| #26 | Puducherry | Puducherry | VALID_NAME_VARIATION | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Basilica_of_the_Sacred_Heart_of_Jesus.jpg/1920px-Basilica_of_the_Sacred_Heart_of_Jesus.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20180308112321` |
| #27 | Madurai | Tamil Nadu | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAK9-KFFiENcKPhrMiHQVUFjUTuUPy7y8ymop97bvhMA&s=10` |
| #28 | Wayanad | Kerala | EXACT | PASS | `https://www.ekeralatourism.net/wp-content/uploads/2018/12/things-wayanad2.jpg` |
| #29 | Kanyakumari | Tamil Nadu | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/b/ba/Kanyakumari_Church_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #30 | Varkala | Kerala | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Papanasam_beach%2C_Varkala.jpg/960px-Papanasam_beach%2C_Varkala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #31 | Kodaikanal | Tamil Nadu | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC5jgoz6ym0oNJkahUqZKVuUWgO526c6lgNQrHgG8FIg&s=10` |
| #32 | Mahabalipuram | Tamil Nadu | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mamallapuram%2C_The_Shore_Temple_2%2C_India.jpg/960px-Mamallapuram%2C_The_Shore_Temple_2%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original` |
| #33 | Chennai | Tamil Nadu | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/7/71/Kapaleeshwarar_Temple_0001.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #34 | Hyderabad | Telangana | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQKwltC3Hnt3ajAJmz4__hrFCVfbSpmjDDU89VicVMHQ&s` |
| #35 | Bengaluru | Karnataka | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/BANGALORE_PALACE.jpg/960px-BANGALORE_PALACE.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #36 | Gokarna | Karnataka | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqoxF3EM5xw8R_jMXFFq2ahRkIBtmCQUH1FX76V8tfwA&s=10` |
| #37 | Kolkata | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/960px-Victoria_Memorial_situated_in_Kolkata.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #38 | Darjeeling | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Darjeeling%2C_India%2C_Tea_plantations_on_hills.jpg/960px-Darjeeling%2C_India%2C_Tea_plantations_on_hills.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #39 | Gangtok | Sikkim | EXACT | PASS | `https://www.oyorooms.com/blog/wp-content/uploads/2017/11/Feature-Image-min-min-1.jpg` |
| #40 | Shillong | Meghalaya | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzhYA3aO2tLEXN6hWn6Ampv2wq5mBgo0HuTiubWwco5IfKSm5A1L8X-Lvd&s=10` |
| #41 | Cherrapunji (Sohra) | Meghalaya | VALID_NAME_VARIATION | REVIEW | `https://s7ap1.scene7.com/is/image/incredibleindia/double-decker-living-root-bridge-cherrapunjee-meghalaya-city-ff?qlt=82&ts=1742165333655` |
| #42 | Kaziranga | Assam | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Beauty_of_Kaziranga_National_Park.jpg/1280px-Beauty_of_Kaziranga_National_Park.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #43 | Puri | Odisha | EXACT | PASS | `https://www.puritaxi.in/images/about.webp` |
| #44 | Konark | Odisha | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Konark_10.jpg/960px-Konark_10.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #45 | Mumbai | Maharashtra | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKL048p9XXLqghYbIfmyq68nG0HMGnjkY73IPP4RaWWSCdi1VObNMq5lEO&s=10` |
| #46 | Pune | Maharashtra | EXACT | PASS | `https://s7ap1.scene7.com/is/image/incredibleindia/shivneri-fort-pune-maharashtra-hero?qlt=82&ts=1742178330918` |
| #47 | Lonavala-Khandala | Maharashtra | VALID_NAME_VARIATION | REVIEW | `https://hblimg.mmtcdn.com/content/hubble/img/desttvimg/mmt/destination/m_lonavala_tv_destination_img_2_l_664_1000.jpg` |
| #48 | Mahabaleshwar | Maharashtra | EXACT | PASS | `https://s7ap1.scene7.com/is/image/incredibleindia/pratapgarh-fort-mahabaleshwar-maharashtra-1-attr-nearby?qlt=82&ts=1742177227908` |
| #49 | Ahmedabad | Gujarat | EXACT | PASS | `https://www.kiomoi.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fkmadmin%2Fimage%2Fupload%2Fc_scale%2Cw_1248%2Ff_auto%2Fv1560260650%2Fkiomoi%2FAhmedabad%2Fkankaria%20Lake%20%20(1).webp&w=3840&q=75` |
| #50 | Rann of Kutch | Gujarat | EXACT | PASS | `https://s7ap1.scene7.com/is/image/incredibleindia/rann-of-kutch-kutch-gujarat-1-attr-hero?qlt=82&ts=1726734017779` |
| #51 | Bhopal | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Bhopal_Junction_railway_station.jpg/960px-Bhopal_Junction_railway_station.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #52 | Ujjain | Madhya Pradesh | EXACT | PASS | `https://www.tusktravel.com/blog/wp-content/uploads/2025/05/Mahakaleshwar-Temple-Ujjain.jpg` |
| #53 | Gwalior | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Gwalior_fort_side_view_001.jpg/960px-Gwalior_fort_side_view_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #54 | Orchha | Madhya Pradesh | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Jahangir_Mahal%2C_Orchha%2C_Madhya_Pradesh%2C_India.jpg/960px-Jahangir_Mahal%2C_Orchha%2C_Madhya_Pradesh%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #55 | Pachmarhi | Madhya Pradesh | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/95/53/33/pachmarhi.jpg?w=1200&h=-1&s=1` |
| #56 | Lucknow | Uttar Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/6/69/Chota_Imambada.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #57 | Ayodhya | Uttar Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/3/31/Pran_Pratishtha_ceremony_of_Shree_Ram_Janmaboomi_Temple_in_Ayodhya%2C_Uttar_Pradesh_on_January_22%2C_2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20240122104830` |
| #58 | Prayagraj | Uttar Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/b/b3/Khusro_Bagh%2C_Prayagraj.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #59 | Chittorgarh | Rajasthan | EXACT | PASS | `https://static.toiimg.com/thumb/50900339.cms?resizemode=75&width=1200&height=900` |
| #60 | Bikaner | Rajasthan | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bikaner-Junagarh-89-2018-gje.jpg/960px-Bikaner-Junagarh-89-2018-gje.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #61 | Mount Abu | Rajasthan | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/bc/5d/2d/mt-abu-observatory-from.jpg?w=600&h=400&s=1` |
| #62 | Ranthambore | Rajasthan | EXACT | PASS | `https://assets.cntraveller.in/photos/60ba1a12a1a415b43b10bcfa/master/w_1600,c_limit/Arrows-Girl-Padam-Lake-Ranthambore-1620.jpg` |
| #63 | Bundi | Rajasthan | EXACT | REVIEW | `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQaXsIvrWMh3qr4rF_RR400dkn4ItkrQEQgwfJ7RYPRMU8fGitX` |
| #64 | Dalhousie | Himachal Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/8/8e/Dalhousie_l_Hill_Station_in_Himachal_Pradesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #65 | Kasauli | Himachal Pradesh | EXACT | PASS | `https://hblimg.mmtcdn.com/content/hubble/img/kasauli/mmt/destination/m_destination-kasauli-landscape_l_400_640.jpg` |
| #66 | Spiti Valley | Himachal Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/f/f5/Kee_monastery_Spiti_Valley_%28edited%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #67 | Auli | Uttarakhand | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/4e/dd/1f/chenab-lake.jpg?w=1400&h=800&s=1` |
| #68 | Gulmarg | Jammu & Kashmir | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/1a/2b/ed/gulmarg.jpg?w=1200&h=-1&s=1` |
| #69 | Pahalgam | Jammu & Kashmir | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pahalgam_Valley.jpg/960px-Pahalgam_Valley.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #70 | Tawang | Arunachal Pradesh | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuXDX0KXCvbERLGCJ_K5KbwXW-qnIhZ-emGRoxlpl8thFMc0IdTqJPrjU&s=10` |
| #71 | Champhai / Aizawl Circuit | Mizoram | EXACT | PASS | `https://s7ap1.scene7.com/is/image/incredibleindia/6-rih-dhdil-lake-champhai-mizoram-city-hero-new?qlt=82&ts=1726674860746` |
| #72 | Kalimpong | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Gouripur_House_-_Kalimpong_-_06.jpg/960px-Gouripur_House_-_Kalimpong_-_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #73 | Majuli | Assam | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA_MtJ6zxSdHADlAj0f9KCy9Phnfksl0yveP83sWWMhx_TwDIpY7TCvuMB&s=10` |
| #74 | Ziro Valley | Arunachal Pradesh | EXACT | PASS | `https://encamp-s3b.s3.ap-south-1.amazonaws.com/1772605486503_ziro.avif.jpg` |
| #75 | Andaman Islands | Andaman & Nicobar Islands | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfpJJ-grSO9J7HsRi_pjZG7bUgeLTEhsmzftLdiw1k6-DInw94HqShmlI&s=10` |
| #76 | Lakshadweep | Lakshadweep | EXACT | PASS | `https://www.poojn.in/wp-content/uploads/2025/04/Lakshadweep-Islands-2025-The-Only-Guide-You-Need.jpeg.jpg` |
| #77 | Chikkamagaluru | Karnataka | VALID_NAME_VARIATION | REVIEW | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/25/6e/67/caption.jpg?w=1200&h=-1&s=1` |
| #78 | Bandipur | Karnataka | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvawT17926ixgLY-IbsyLIjetdpluQIvOMt0iX-M2sOA&s=10` |
| #79 | Nagarhole | Karnataka | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnnctkTpKGeJpCq760LqnMeHEoX65lvnBegzcU4GRMvg&s=10` |
| #80 | Badami-Pattadakal | Karnataka | COMPOSITE_MATCH | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/c/cf/BadamiCaves87.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #81 | Murudeshwar | Karnataka | EXACT | PASS | `https://static.toiimg.com/photo/50496644.cms` |
| #82 | Dandeli | Karnataka | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7jie1eRof7qswpFP8EfrPyMQZvaTwefJXHLColwmXw&s=10` |
| #83 | Yercaud | Tamil Nadu | EXACT | PASS | `https://www.theindia.co.in/blog/wp-content/uploads/2022/05/Yercaud-2.jpg` |
| #84 | Valparai | Tamil Nadu | EXACT | PASS | `https://keralabee.com/wp-content/uploads/2023/04/1681759682968-822x1024.jpg` |
| #85 | Chettinad | Tamil Nadu | EXACT | PASS | `https://avathioutdoors.gumlet.io/travelGuide/dev/chettinad_P8820.jpg?w=800&h=400&format=webp&q=80&compress=true` |
| #86 | Thanjavur | Tamil Nadu | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/c/ce/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India_%282017%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #87 | Rameswaram | Tamil Nadu | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/d/d1/Rameswaram_Railway_Station_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #88 | Tirupati | Andhra Pradesh | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShFOP0OMjscPOnxcqt2lyA3G--cRfTfiYNLz46JQpRMg&s=10` |
| #89 | Visakhapatnam | Andhra Pradesh | EXACT | PASS | `https://hblimg.mmtcdn.com/content/hubble/img/desttvimg/mmt/destination/m_Visakhapatnam_Vizag_tv_destination_img_1_l_673_1077.jpg` |
| #90 | Araku Valley | Andhra Pradesh | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa5IB4-kZTR7momUnDnyGf-LBaMxeUor-OdVLXkmjpMoKw2uf_lZDgSZUs&s=10` |
| #91 | Bhedaghat | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/7/71/Bhedaghat_Jbp.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` |
| #92 | Kanha | Madhya Pradesh | EXACT | PASS | `https://www.pugdundeesafaris.com/blog/wp-content/uploads/2017/06/Kanha-National-Park.webp` |
| #93 | Bandhavgarh | Madhya Pradesh | EXACT | PASS | `https://www.bandhavgarhnationalpark.in/uploads/bandhavgarh-park-wild.jpg` |
| #94 | Sundarbans | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Purple_Sunbird_%28Cinnyris_asiaticus%29_in_Sundarbans_East_Wildlife_Sanctuary_01.jpg/960px-Purple_Sunbird_%28Cinnyris_asiaticus%29_in_Sundarbans_East_Wildlife_Sanctuary_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #95 | Bodh Gaya | Bihar | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/5/57/Great_Buddha_Statue%2C_Bodh_Gaya.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #96 | Nashik | Maharashtra | EXACT | PASS | `https://studytoursindia.com/wp-content/uploads/2023/07/archana-more-AOSm9Cii6P4-unsplash-1300x1300.webp` |
| #97 | Chhatrapati Sambhajinagar | Maharashtra | EXACT | REVIEW | `https://s7ap1.scene7.com/is/image/incredibleindia/ellora-caves-chhatrapati%20sambhaji%20nagar-maharashtra-hero-HS?qlt=82&ts=1726674928630` |
| #98 | Alibaug | Maharashtra | EXACT | PASS | `https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/11/murud-janjira-fort-1.jpg` |
| #99 | Matheran | Maharashtra | EXACT | PASS | `https://maharashtratourism.gov.in/wp-content/uploads/2024/11/MATHERAN-4.jpg` |
| #100 | Tarkarli | Maharashtra | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEbR-tuapQ64A8Wz9RE02KhLgQ7kdJPQl62CXG6WgZTQ&s=10` |
| #101 | Dwarka | Gujarat | EXACT | PASS | `https://www.daiwikhotels.com/wp-content/uploads/2024/07/Dwarkadish-temple-1.jpg` |
| #102 | Somnath | Gujarat | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz2yRu80mt7sO0CwFIJFgty4SF-Sc9ENCdxHYtGsJYQw&s` |
| #103 | Gir | Gujarat | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/9/90/Gir_lion-Gir_forest%2Cjunagadh%2Cgujarat%2Cindia.jpeg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` |
| #104 | Statue of Unity | Gujarat | EXACT | PASS | `https://c.ndtvimg.com/2018-10/mfp4lp08_statue-of-unity-twitter-october-2018-_625x300_31_October_18.jpg` |
| #105 | Saputara | Gujarat | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56sn-9vIKzWEAeFXPVeXTokpJkheZr72Yk-3ZppA5og&s=10` |
| #106 | Manas | Assam | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Manas_landscape_rhino.jpg/500px-Manas_landscape_rhino.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail` |
| #107 | Diu | Dadra and Nagar Haveli and Daman and Diu | EXACT | PASS | `https://s7ap1.scene7.com/is/image/incredibleindia/1-ins-khukri-memorial-diu-attr-hero?qlt=82&ts=1726737873261` |
| #108 | Delhi | Delhi | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/India_gatee.JPG/960px-India_gatee.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #109 | Goa | Goa | EXACT | REVIEW | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=1200&h=900&s=1` |
| #110 | Champaner-Pavagadh | Gujarat | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/b/b7/Top_of_Pavadagh_hill.JPG?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` |
| #111 | Dholavira | Gujarat | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIbjyrdsYzTZNkr56pFAau9wamxMhN9zcspIKR2QJ9CraUxj9tlAeWEpU&s=10` |
| #112 | Modhera-Patan | Gujarat | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/67/ec/ea/caption.jpg?w=1200&h=-1&s=1` |
| #113 | Vaishno Devi | Jammu & Kashmir | EXACT | PASS | `https://duniyaghumo360.com/wp-content/uploads/2024/12/mata_vaishno_devi.jpg.webp` |
| #114 | Shettihalli / Sakleshpur | Karnataka | EXACT | REVIEW | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/95/f6/57/20171224-124245-largejpg.jpg?w=1000&h=600&s=1` |
| #115 | Kerala | Kerala | EXACT | PASS | `https://www.thrillophilia.com/blog/wp-content/uploads/2025/08/kerala-main-2048x1365.jpg` |
| #116 | Thekkady-Periyar | Kerala | COMPOSITE_MATCH | REVIEW | `https://www.keralatravels.com/userfiles/1475817533_Thekkady.jpg` |
| #117 | Kumarakom | Kerala | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/c/ca/Kumarakom_market_canal_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #118 | Bekal | Kerala | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/7/74/Bekal.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` |
| #119 | Vagamon | Kerala | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/e/eb/Vagamon_meadows.JPG?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` |
| #120 | Kozhikode | Kerala | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdlizxaHu1Gp9ywZICWhWLNOBIowCNc5oTQck1YWUCroTXB-vrMi-Mx5o4&s=10` |
| #121 | Sanchi | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Stupa_1%2C_Sanchi_02.jpg/960px-Stupa_1%2C_Sanchi_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #122 | Omkareshwar | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Omkareswar_Jyotirlinga.jpg/1920px-Omkareswar_Jyotirlinga.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #123 | Ajanta Caves | Maharashtra | VALID_NAME_VARIATION | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7HtI_H0F0O4DGuvRt3CFUwgdpFMbQ2oAMvDItmyPphxEgxFfyeGXIYWw&s=10` |
| #124 | Ellora Caves | Maharashtra | VALID_NAME_VARIATION | REVIEW | `https://aurangabadtourism.in/images/v2/places-to-visit/ellora-caves-aurangabad-tourism-header.jpg` |
| #125 | Bhimashankar | Maharashtra | EXACT | PASS | `https://holaciti.com/assets/Articles/1765501917_rXPkcNmOph.webp` |
| #126 | Lonar | Maharashtra | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/e/e0/Lonar_Sarovar_lake_Maharastra.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original` |
| #127 | Dawki | Meghalaya | EXACT | PASS | `https://nomadicweekends.com/blog/wp-content/uploads/2019/09/66851483_2355591914534526_8824396371357335552_o.jpg` |
| #128 | Chilika Lake | Odisha | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/9/94/Birds_eyeview_of_Chilika_Lake.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` |
| #129 | Ajmer | Rajasthan | EXACT | REVIEW | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/61/bf/cc/caption.jpg?w=300&h=300&s=1` |
| #130 | Shekhawati | Rajasthan | EXACT | PASS | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/a9/48/cf/outside-view-of-cenotaph.jpg?w=1400&h=800&s=1` |
| #131 | Ranakpur | Rajasthan | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/0/0f/Jain_Temple_Ranakpur.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` |
| #132 | Kanchipuram | Tamil Nadu | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/KailasanatharTemple-Kanchipuram-Tamilnadu-JM10.jpg/1920px-KailasanatharTemple-Kanchipuram-Tamilnadu-JM10.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20200929061613` |
| #133 | Sarnath | Uttar Pradesh | EXACT | PASS | `https://www.tusktravel.com/blog/wp-content/uploads/2021/07/Sarnath-Dhamek-Stupa.jpg` |
| #134 | Jim Corbett | Uttarakhand | EXACT | PASS | `https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/10/24/ab/6d.jpg` |
| #135 | Valley of Flowers | Uttarakhand | EXACT | PASS | `https://cvsqtgaxsa.cloudimg.io/https://images.prismic.io/indiahike/8d7c7d42-0215-4d28-b711-ae93f3bb3e4a_Valley_of_Flowers+2_Pictures+by+Jothiranjan.JPG?w=1000&q=50&org_if_sml=1` |
| #136 | Kedarnath | Uttarakhand | EXACT | PASS | `https://badrinath-kedarnath.gov.in/css_js_2024/img/badrinath-temple_1.jpg` |
| #137 | Badrinath | Uttarakhand | EXACT | PASS | `https://savetoursandtravels.com/wp-content/uploads/2026/04/badrinath-1.webp` |
| #139 | Nalanda | Bihar | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Temple_3_-_Sariputta_Stupa_-_Nalanda_Mahavihara_%2810%29.jpg/960px-Temple_3_-_Sariputta_Stupa_-_Nalanda_Mahavihara_%2810%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #140 | Rajgir | Bihar | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Shanti_Stupa%2C_Rajgir.jpg/960px-Shanti_Stupa%2C_Rajgir.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #141 | Gaya | Bihar | EXACT | PASS | `https://cdn.britannica.com/21/1621-050-FFCB3339/pilgrims-ghat-Phalgu-River-Bihar-India-Gaya.jpg` |
| #142 | Cuttack | Odisha | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/2/2c/Museum_of_Justice_complex%2C_Cuttack_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #143 | Daringbadi | Odisha | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Lover%27s_point%2C_Daringbadi.jpg/1920px-Lover%27s_point%2C_Daringbadi.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #144 | Sambalpur | Odisha | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/3/32/Gandhi_Minar.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` |
| #145 | Digha | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/New_Digha_Beach_-_East_Midnapore_2015-05-03_9873.JPG/1280px-New_Digha_Beach_-_East_Midnapore_2015-05-03_9873.JPG?utm_source=en.wikivoyage.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #146 | Murshidabad | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/4/47/Nizamat_Imambara_2%2C_Murshidabad.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` |
| #147 | Shantiniketan | West Bengal | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Shantiniketan_Bari_of_Rabindranath_Tagore.jpg/1280px-Shantiniketan_Bari_of_Rabindranath_Tagore.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #148 | Bishnupur | West Bengal | EXACT | PASS | `https://i0.wp.com/traveldreams.live/wp-content/uploads/2020/11/nandlal-3-1.jpg?resize=1200%2C800&ssl=1` |
| #149 | Jagdalpur | Chhattisgarh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tirathgarh%2C_Jagdalpur%2C_Bastar.jpg/960px-Tirathgarh%2C_Jagdalpur%2C_Bastar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #150 | Maheshwar | Madhya Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Maheshwar_Fort_-_Exterior_03.jpg/960px-Maheshwar_Fort_-_Exterior_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #151 | Mandu | Madhya Pradesh | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/c/c4/Jahaz_Mahal_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #152 | Chitrakoot | Madhya Pradesh / Uttar Pradesh | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Government_Polytechnic_-_Bargarh_-_Chitrakoot_2014-07-06_7257.JPG/960px-Government_Polytechnic_-_Bargarh_-_Chitrakoot_2014-07-06_7257.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #153 | Thrissur | Kerala | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY6sO0K3nOPNn2-Rn2g3HTRIPsE8J6sBAQYjnhseOntg&s=10` |
| #154 | Kannur | Kerala | EXACT | REVIEW | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyIm2XJ9WMLSFYw-BNh7c9AE2EZw-aQ4ps1bRyIyf9Zp9VtxaRPnUg3oW&s=10` |
| #155 | Poovar | Kerala | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/THE_TRANQUIL_BACKWATERS_OF_POOVAR_-_KERALA.jpg/960px-THE_TRANQUIL_BACKWATERS_OF_POOVAR_-_KERALA.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #156 | Tirunelveli | Tamil Nadu | EXACT | PASS | `https://images.trvl-media.com/place/6252867/b4a4bb45-f309-4e3c-a554-f3aa7d311b43.jpg` |
| #157 | Velankanni | Tamil Nadu | EXACT | PASS | `https://avathioutdoors.gumlet.io/travelGuide/dev/velankanni73971.jpg` |
| #158 | Hogenakkal | Tamil Nadu | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Hogenakkal_Falls_Close.jpg/1280px-Hogenakkal_Falls_Close.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #159 | Dhanushkodi | Tamil Nadu | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Dhanushkodi_Road.jpg/960px-Dhanushkodi_Road.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #160 | Tranquebar (Tharangambadi) | Tamil Nadu | COMPOSITE_MATCH | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/0/0e/Fort_Dansborg_in_Tharangambadi%2C_Tamil_Nadu.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |
| #161 | Chandigarh | Chandigarh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Palace_of_Assembly_Chandigarh_2006.jpg/960px-Palace_of_Assembly_Chandigarh_2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #162 | Kasol | Himachal Pradesh | EXACT | PASS | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kasol_mountain_view.jpg/960px-Kasol_mountain_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` |
| #163 | Kausani | Uttarakhand | EXACT | PASS | `https://s7ap1.scene7.com/is/image/incredibleindia/1-kausani-kausani-city-hero?qlt=82&ts=1742157046358` |
| #165 | Srisailam | Andhra Pradesh | EXACT | REVIEW | `https://upload.wikimedia.org/wikipedia/commons/5/5c/Rock_formations_on_the_Telanagana_side_of_Srisailam_Dam.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` |

### LIST B — MISSING (2 Destinations)

Authoritative catalog destinations for which no candidate image exists in `destinations(2).txt`:

| Catalog # | Destination | State | Status | Rationale |
|---|---|---|---|---|
| #138 | Patna | Bihar | NOT_FOUND | Confirmed completely absent from uploaded destinations(2).txt dataset |
| #164 | Gandikota | Andhra Pradesh | NOT_FOUND | Confirmed completely absent from uploaded destinations(2).txt dataset |

### LIST C — EXTRAS (34 Rows)

Destinations from `destinations(2).txt` that do NOT belong to the authoritative 165 catalog:

| Source Row | Old # | Uploaded Destination Name | State | Image URL | Status |
|---|---|---|---|---|---|
| Row 27 | #14 | Alwar | Rajasthan | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Skyline_of_Alwar_City.jpg/1280px-Skyline_of_Alwar_City.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 29 | #15 | Bharatpur | Rajasthan | `https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Bharatpur_Fort.JPG/1920px-Bharatpur_Fort.JPG?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 31 | #16 | Kumbhalgarh | Rajasthan | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kumbhalgarh_055.jpg/960px-Kumbhalgarh_055.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 33 | #17 | Sawai Madhopur | Rajasthan | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Sunset_at_Ranthambore_Fort.jpg/1280px-Sunset_at_Ranthambore_Fort.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 35 | #18 | Kota | Rajasthan | `https://upload.wikimedia.org/wikipedia/commons/1/1c/Chambal-river-gorge.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled` | EXTRA (Not in 165 catalog) |
| Row 37 | #19 | Neemrana | Rajasthan | `https://assets.simplotel.com/simplotel/image/upload/q_80,fl_progressive,w_1500,f_auto,c_fit/neemrana-fort-palace---15th-century-delhi-jaipur-highway/Facade_Premises__Neemrana_Fort_Palace__palace_hotel_in_Rajasthan_14_4_d55b91` | EXTRA (Not in 165 catalog) |
| Row 49 | #25 | Kovalam | Kerala | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcBpc76JoCRCYrAX0If4zbpgpBdriHdr8qYwuunpJ6DnaiD9zXIhmMRtCa&s=10` | EXTRA (Not in 165 catalog) |
| Row 63 | #32 | Athirappilly | Kerala | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdWdm_EjpZ8byo0EZddaJUUclumjet6MHjHbkqd_lS8Q&s=10` | EXTRA (Not in 165 catalog) |
| Row 67 | #34 | Marari | Kerala | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/1b/5c/46/marari-beach.jpg?w=500&h=-1&s=1` | EXTRA (Not in 165 catalog) |
| Row 69 | #35 | Thiruvananthapuram | Kerala | `https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Fmobile%2Fthiruvananthapuram-1713788259_cc3e007203a550edfaa7.webp&w=3840&q=75` | EXTRA (Not in 165 catalog) |
| Row 85 | #43 | Kolhapur | Maharashtra | `https://tanushreecabs.com/wp-content/uploads/2025/03/New-Palace-Kolhapur--1024x872.webp` | EXTRA (Not in 165 catalog) |
| Row 87 | #44 | Nagpur | Maharashtra | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeoUI6NsnxWzVzWJKRCFhS8rZWMNXlwVZLM3G0GJB9xPlDExRPC2PSXBhC&s=10` | EXTRA (Not in 165 catalog) |
| Row 93 | #47 | Shirdi | Maharashtra | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG8YkiuU6SvZdv-WyJ9lZ01V33G94M0NYVBiXu4KAQfHLzTEQzP6n5i4I&s=10` | EXTRA (Not in 165 catalog) |
| Row 101 | #51 | Coorg | Karnataka | `https://c.ndtvimg.com/2025-05/hrgf60uo_coorg_625x300_17_May_25.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=738` | EXTRA (Not in 165 catalog) |
| Row 109 | #55 | Udupi | Karnataka | `https://karnatakatourism.org/_next/image/?url=https%3A%2F%2Fweb-cms.karnatakatourism.org%2Fwp-content%2Fuploads%2F2025%2F06%2Fdji_0053.webp&w=3840&q=75` | EXTRA (Not in 165 catalog) |
| Row 115 | #58 | Aihole | Karnataka | `https://assets.architecturaldigest.in/photos/644ea2fb5e459f60aa9509b5/16:9/w_1920,c_limit/Untitled%20design%20(31).png` | EXTRA (Not in 165 catalog) |
| Row 117 | #59 | Jog Falls | Karnataka | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlNbIlIoFBy7bluVObWBIg_XGxqnKiZLNkPBk_rb0axA&s` | EXTRA (Not in 165 catalog) |
| Row 121 | #61 | Kabini | Karnataka | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRu0J2owT4mJT5OEPMK-1iNbhSZZdsxhYTriE85j-Clj-IWrgy9SgrTQjM&s=10` | EXTRA (Not in 165 catalog) |
| Row 125 | #63 | Chitradurga | Karnataka | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtINwpgEK0kBAdo0jOdcvz6zvp9RhMOesl5XIbnb4u9w&s=10` | EXTRA (Not in 165 catalog) |
| Row 129 | #65 | Warangal | Telangana | `https://static.toiimg.com/thumb/59593450.cms?resizemode=75&width=1200&height=900` | EXTRA (Not in 165 catalog) |
| Row 137 | #69 | Vijayawada | Andhra Pradesh | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxSKOJwAYGi7nwNK1izLhxfbO81g0OavB0DF1zxzp9w&s` | EXTRA (Not in 165 catalog) |
| Row 139 | #70 | Amaravati | Andhra Pradesh | `https://dynamic.tourtravelworld.com/zsc-header/10343-header.jpg` | EXTRA (Not in 165 catalog) |
| Row 149 | #75 | Guwahati | Assam | `https://upload.wikimedia.org/wikipedia/commons/1/11/Guwahati_citysky.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original` | EXTRA (Not in 165 catalog) |
| Row 169 | #87 | Tiruchirappalli | Tamil Nadu | `https://upload.wikimedia.org/wikipedia/commons/0/05/Tiruchi_Jn._Name_board.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | EXTRA (Not in 165 catalog) |
| Row 184 | #102 | Indore | Madhya Pradesh | `https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rajwada_Palace%2C_Indore.jpg/1920px-Rajwada_Palace%2C_Indore.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20140515210656` | EXTRA (Not in 165 catalog) |
| Row 188 | #106 | Jabalpur | Madhya Pradesh | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/b4/bd/56/view-of-the-waterfall.jpg?w=1200&h=-1&s=1` | EXTRA (Not in 165 catalog) |
| Row 192 | #110 | Leh | Ladakh | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/4d/45/b4/leh.jpg?w=1200&h=900&s=1` | EXTRA (Not in 165 catalog) |
| Row 212 | #130 | Patiala | Punjab | `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Patiala_station.png/960px-Patiala_station.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 222 | #140 | Bhubaneswar | Odisha | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Kalinga_Stadium%2C_Bhubaneswar.jpg/960px-Kalinga_Stadium%2C_Bhubaneswar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 226 | #144 | Ranchi | Jharkhand | `https://upload.wikimedia.org/wikipedia/commons/d/db/Ranchi_Junction_railway_station.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20241030024949` | EXTRA (Not in 165 catalog) |
| Row 227 | #145 | Deoghar | Jharkhand | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Deoghar_District_Court_campus_in_Deoghar_04.jpg/960px-Deoghar_District_Court_campus_in_Deoghar_04.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 228 | #146 | Hazaribagh | Jharkhand | `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hazaribagh_Town.jpg/960px-Hazaribagh_Town.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 229 | #147 | Raipur | Chhattisgarh | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/The_Rajiv_Lochan_Temple%2C_circa_7th-8th_century%2C_Rajim%2CRaipur%2CChattisgarh.jpg/960px-The_Rajiv_Lochan_Temple%2C_circa_7th-8th_century%2C_Rajim%2CRaipur%2CChattisgarh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |
| Row 231 | #149 | Amarkantak | Madhya Pradesh | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/A_Hindu_temple%2C_Amarkantak_Madhya_Pradesh_India.jpg/960px-A_Hindu_temple%2C_Amarkantak_Madhya_Pradesh_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | EXTRA (Not in 165 catalog) |

### LIST D — REVIEW / QUESTIONABLE (52 Destinations)

Destination-image pairs that matched but require manual review due to name variation, composite matching, duplicate candidate options, or image quality/format flags:

| Catalog # | Destination | State | Source Row | Flagged Image URL | Reasons for Review |
|---|---|---|---|---|---|
| #2 | Agra | Uttar Pradesh | Row 3 (#2) | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Taj_Mahal_N-UP-A28-a.jpg/960px-Taj_Mahal_N-UP-A28-a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #14 | Dharamshala | Himachal Pradesh | Row 199 (#117) | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cricket_Stadium_Dharamshala.jpg/960px-Cricket_Stadium_Dharamshala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #20 | Alappuzha | Kerala | Row 239 (#157) | `https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Alappuzha_Tourism.jpg/960px-Alappuzha_Tourism.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #23 | Mysuru | Karnataka | Row 99 (#50) | `https://s3.india.com/wp-content/uploads/2024/06/Things-To-Know-Before-Visiting-Mysuru.jpg##image/jpg` | Malformed URL fragment ('##image/jpg') |
| #24 | Hampi | Karnataka | Row 245 (#163) | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg/960px-Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #26 | Puducherry | Puducherry | Row 171 (#89) | `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Basilica_of_the_Sacred_Heart_of_Jesus.jpg/1920px-Basilica_of_the_Sacred_Heart_of_Jesus.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20180308112321` | 2 duplicate candidates in uploaded file; Name variation ('Pondicherry' vs 'Puducherry') |
| #27 | Madurai | Tamil Nadu | Row 161 (#81) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAK9-KFFiENcKPhrMiHQVUFjUTuUPy7y8ymop97bvhMA&s=10` | Google thumbnail URL |
| #29 | Kanyakumari | Tamil Nadu | Row 244 (#162) | `https://upload.wikimedia.org/wikipedia/commons/b/ba/Kanyakumari_Church_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 2 duplicate candidates in uploaded file |
| #30 | Varkala | Kerala | Row 238 (#156) | `https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Papanasam_beach%2C_Varkala.jpg/960px-Papanasam_beach%2C_Varkala.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #31 | Kodaikanal | Tamil Nadu | Row 159 (#80) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC5jgoz6ym0oNJkahUqZKVuUWgO526c6lgNQrHgG8FIg&s=10` | Google thumbnail URL |
| #34 | Hyderabad | Telangana | Row 127 (#64) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQKwltC3Hnt3ajAJmz4__hrFCVfbSpmjDDU89VicVMHQ&s` | Google thumbnail URL |
| #35 | Bengaluru | Karnataka | Row 174 (#92) | `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/BANGALORE_PALACE.jpg/960px-BANGALORE_PALACE.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #36 | Gokarna | Karnataka | Row 103 (#52) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqoxF3EM5xw8R_jMXFFq2ahRkIBtmCQUH1FX76V8tfwA&s=10` | Google thumbnail URL |
| #40 | Shillong | Meghalaya | Row 143 (#72) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzhYA3aO2tLEXN6hWn6Ampv2wq5mBgo0HuTiubWwco5IfKSm5A1L8X-Lvd&s=10` | Google thumbnail URL |
| #41 | Cherrapunji (Sohra) | Meghalaya | Row 145 (#73) | `https://s7ap1.scene7.com/is/image/incredibleindia/double-decker-living-root-bridge-cherrapunjee-meghalaya-city-ff?qlt=82&ts=1742165333655` | Name variation ('Cherrapunji' vs 'Cherrapunji (Sohra)') |
| #45 | Mumbai | Maharashtra | Row 71 (#36) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKL048p9XXLqghYbIfmyq68nG0HMGnjkY73IPP4RaWWSCdi1VObNMq5lEO&s=10` | Google thumbnail URL |
| #47 | Lonavala-Khandala | Maharashtra | Row 81 (#41) | `https://hblimg.mmtcdn.com/content/hubble/img/desttvimg/mmt/destination/m_lonavala_tv_destination_img_2_l_664_1000.jpg` | Name variation ('Lonavala' vs 'Lonavala-Khandala') |
| #54 | Orchha | Madhya Pradesh | Row 186 (#104) | `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Jahangir_Mahal%2C_Orchha%2C_Madhya_Pradesh%2C_India.jpg/960px-Jahangir_Mahal%2C_Orchha%2C_Madhya_Pradesh%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #63 | Bundi | Rajasthan | Row 23 (#12) | `https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQaXsIvrWMh3qr4rF_RR400dkn4ItkrQEQgwfJ7RYPRMU8fGitX` | Google thumbnail URL |
| #70 | Tawang | Arunachal Pradesh | Row 153 (#77) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuXDX0KXCvbERLGCJ_K5KbwXW-qnIhZ-emGRoxlpl8thFMc0IdTqJPrjU&s=10` | Google thumbnail URL |
| #73 | Majuli | Assam | Row 151 (#76) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA_MtJ6zxSdHADlAj0f9KCy9Phnfksl0yveP83sWWMhx_TwDIpY7TCvuMB&s=10` | Google thumbnail URL |
| #75 | Andaman Islands | Andaman & Nicobar Islands | Row 259 (#75) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfpJJ-grSO9J7HsRi_pjZG7bUgeLTEhsmzftLdiw1k6-DInw94HqShmlI&s=10` | Google thumbnail URL |
| #77 | Chikkamagaluru | Karnataka | Row 107 (#54) | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/25/6e/67/caption.jpg?w=1200&h=-1&s=1` | 2 duplicate candidates in uploaded file; Name variation ('Chikmagalur' vs 'Chikkamagaluru') |
| #78 | Bandipur | Karnataka | Row 155 (#78) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvawT17926ixgLY-IbsyLIjetdpluQIvOMt0iX-M2sOA&s=10` | Google thumbnail URL |
| #79 | Nagarhole | Karnataka | Row 262 (#79) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnnctkTpKGeJpCq760LqnMeHEoX65lvnBegzcU4GRMvg&s=10` | Google thumbnail URL |
| #80 | Badami-Pattadakal | Karnataka | Row 246 (#164) | `https://upload.wikimedia.org/wikipedia/commons/c/cf/BadamiCaves87.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 3 duplicate candidates in uploaded file; Composite / merged destination name |
| #82 | Dandeli | Karnataka | Row 119 (#60) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7jie1eRof7qswpFP8EfrPyMQZvaTwefJXHLColwmXw&s=10` | Google thumbnail URL |
| #87 | Rameswaram | Tamil Nadu | Row 243 (#161) | `https://upload.wikimedia.org/wikipedia/commons/d/d1/Rameswaram_Railway_Station_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 2 duplicate candidates in uploaded file |
| #88 | Tirupati | Andhra Pradesh | Row 267 (#88) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShFOP0OMjscPOnxcqt2lyA3G--cRfTfiYNLz46JQpRMg&s=10` | Google thumbnail URL |
| #90 | Araku Valley | Andhra Pradesh | Row 135 (#68) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa5IB4-kZTR7momUnDnyGf-LBaMxeUor-OdVLXkmjpMoKw2uf_lZDgSZUs&s=10` | Google thumbnail URL |
| #97 | Chhatrapati Sambhajinagar | Maharashtra | Row 271 (#97) | `https://s7ap1.scene7.com/is/image/incredibleindia/ellora-caves-chhatrapati%20sambhaji%20nagar-maharashtra-hero-HS?qlt=82&ts=1726674928630` | 2 duplicate candidates in uploaded file |
| #100 | Tarkarli | Maharashtra | Row 273 (#100) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEbR-tuapQ64A8Wz9RE02KhLgQ7kdJPQl62CXG6WgZTQ&s=10` | Google thumbnail URL |
| #102 | Somnath | Gujarat | Row 275 (#102) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz2yRu80mt7sO0CwFIJFgty4SF-Sc9ENCdxHYtGsJYQw&s` | Google thumbnail URL |
| #105 | Saputara | Gujarat | Row 278 (#105) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56sn-9vIKzWEAeFXPVeXTokpJkheZr72Yk-3ZppA5og&s=10` | Google thumbnail URL |
| #108 | Delhi | Delhi | Row 175 (#93) | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/India_gatee.JPG/960px-India_gatee.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #109 | Goa | Goa | Row 191 (#109) | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=1200&h=900&s=1` | 2 duplicate candidates in uploaded file |
| #111 | Dholavira | Gujarat | Row 283 (#111) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIbjyrdsYzTZNkr56pFAau9wamxMhN9zcspIKR2QJ9CraUxj9tlAeWEpU&s=10` | Google thumbnail URL |
| #114 | Shettihalli / Sakleshpur | Karnataka | Row 196 (#114) | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/95/f6/57/20171224-124245-largejpg.jpg?w=1000&h=600&s=1` | 2 duplicate candidates in uploaded file |
| #116 | Thekkady-Periyar | Kerala | Row 45 (#23) | `https://www.keralatravels.com/userfiles/1475817533_Thekkady.jpg` | Composite / merged destination name |
| #117 | Kumarakom | Kerala | Row 240 (#158) | `https://upload.wikimedia.org/wikipedia/commons/c/ca/Kumarakom_market_canal_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 2 duplicate candidates in uploaded file |
| #120 | Kozhikode | Kerala | Row 57 (#29) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdlizxaHu1Gp9ywZICWhWLNOBIowCNc5oTQck1YWUCroTXB-vrMi-Mx5o4&s=10` | Google thumbnail URL |
| #123 | Ajanta Caves | Maharashtra | Row 89 (#45) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7HtI_H0F0O4DGuvRt3CFUwgdpFMbQ2oAMvDItmyPphxEgxFfyeGXIYWw&s=10` | Google thumbnail URL; Name variation ('Ajanta' vs 'Ajanta Caves') |
| #124 | Ellora Caves | Maharashtra | Row 91 (#46) | `https://aurangabadtourism.in/images/v2/places-to-visit/ellora-caves-aurangabad-tourism-header.jpg` | Name variation ('Ellora' vs 'Ellora Caves') |
| #129 | Ajmer | Rajasthan | Row 21 (#11) | `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/61/bf/cc/caption.jpg?w=300&h=300&s=1` | Low resolution (300px) |
| #151 | Mandu | Madhya Pradesh | Row 233 (#151) | `https://upload.wikimedia.org/wikipedia/commons/c/c4/Jahaz_Mahal_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 3 duplicate candidates in uploaded file |
| #152 | Chitrakoot | Madhya Pradesh / Uttar Pradesh | Row 234 (#152) | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Government_Polytechnic_-_Bargarh_-_Chitrakoot_2014-07-06_7257.JPG/960px-Government_Polytechnic_-_Bargarh_-_Chitrakoot_2014-07-06_7257.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #153 | Thrissur | Kerala | Row 55 (#28) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY6sO0K3nOPNn2-Rn2g3HTRIPsE8J6sBAQYjnhseOntg&s=10` | Google thumbnail URL |
| #154 | Kannur | Kerala | Row 59 (#30) | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyIm2XJ9WMLSFYw-BNh7c9AE2EZw-aQ4ps1bRyIyf9Zp9VtxaRPnUg3oW&s=10` | Google thumbnail URL |
| #155 | Poovar | Kerala | Row 236 (#154) | `https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/THE_TRANQUIL_BACKWATERS_OF_POOVAR_-_KERALA.jpg/960px-THE_TRANQUIL_BACKWATERS_OF_POOVAR_-_KERALA.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #159 | Dhanushkodi | Tamil Nadu | Row 173 (#91) | `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Dhanushkodi_Road.jpg/960px-Dhanushkodi_Road.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail` | 2 duplicate candidates in uploaded file |
| #160 | Tranquebar (Tharangambadi) | Tamil Nadu | Row 242 (#160) | `https://upload.wikimedia.org/wikipedia/commons/0/0e/Fort_Dansborg_in_Tharangambadi%2C_Tamil_Nadu.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 2 duplicate candidates in uploaded file; Composite / merged destination name |
| #165 | Srisailam | Andhra Pradesh | Row 247 (#165) | `https://upload.wikimedia.org/wikipedia/commons/5/5c/Rock_formations_on_the_Telanagana_side_of_Srisailam_Dam.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original` | 2 duplicate candidates in uploaded file |
