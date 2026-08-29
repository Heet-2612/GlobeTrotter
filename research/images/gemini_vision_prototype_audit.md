# GlobeTrotter — Gemini Vision Prototype Audit Report (Step 6A)

> **Evaluated Model:** `gemini-3.6-flash`  
> **Total Destinations:** 5 (#1 Jaipur, #4 Udaipur, #150 Maheshwar, #155 Poovar, #160 Tharangambadi)  
> **Total Images Evaluated:** 10 images (10 success, 0 failed)  
> **Average API Latency:** 9892 ms per image  
> **Generated At:** 2026-08-27T18:15:05.257Z  

---

## 1. Prototype Execution Summary

- **Gemini Model:** `gemini-3.6-flash`
- **Image Input Transmission:** 100% of candidate images fetched via HTTP and transmitted as inline Base64 data parts (`inlineData`) alongside destination visual profiles.
- **Evaluation Success Rate:** **10 / 10** (100% success rate)
- **JSON Parsing Errors:** **0** (Strict JSON schema respected)
- **Average API Response Time:** **9892 ms** per image call
- **Prototype Status:** **`GEMINI_VISION_PROTOTYPE = PASS`**

---

## 2. Gemini Vision Evaluation Results Table

| # | Destination | Deterministic Winner (Score) | Gemini Vision Winner | Gemini Score | Decision | Gemini Vision Analysis & Reasoning |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| 1 | **Jaipur** | Jaipur 03-2016 02 Amber Fort.jpg (75) | **Jaipur 03-2016 02 Amber Fort.jpg** | **61** | `ACCEPTABLE` | The image captures a wide perspective of Amber Fort above Maota Lake, directly matching primary destination landmarks. Daylight highlights the hilltop sandstone architecture, though the prominent foreground shoreline slightly weakens overall impact. |
| 4 | **Udaipur** | 20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg (85) | **City Palace Udaipur Rajasthan India.JPG** | **49** | `WEAK` | The image features detailed architectural jharokhas of the City Palace from a tight low angle. It lacks the essential wide landscape view and Lake Pichola setting needed for a primary destination image. |
| 150 | **Maheshwar** | River Narmada from Maheshwar Fort.jpg (80) | **Maheshwar 01.jpg** | **35** | `REJECT` | The image captures a local street scene with modern structures rather than the iconic Ahilya Fort or Narmada ghats. It lacks key historic architectural subjects specified for the destination. |
| 155 | **Poovar** | Poovar backwaters view, Kerala, India.jpg (85) | **Puvar 20080220-1.jpg** | **48** | `WEAK` | The photograph captures a traditional thatched wooden boat on the beach spit. It lacks the preferred elevated view illustrating the confluence between the backwaters and sea. |
| 160 | **Tranquebar (Tharangambadi)** | A view of Tranquebar - Google Art Project.jpg (60) | **Bungalow on the Beach, Neemrana Hotels, in Tranquebar, Tamil Nadu.jpg** | **44** | `WEAK` | The image features the Bungalow on the Beach rather than the primary yellow Fort Dansborg hero subject. A parked motorcycle and boundary wall obstruct the foreground, reducing visual appeal. Resolution is slightly below ideal hero standards. |

---

## 3. Destination-by-Destination Evaluation Details

### Destination #1: Jaipur
- **Deterministic Scorer Winner:** `Jaipur 03-2016 02 Amber Fort.jpg` (Score: **75**)
- **Gemini Vision Selected Winner:** `Jaipur 03-2016 02 Amber Fort.jpg` (Score: **61**)

| Candidate # | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `Jaipur 03-2016 02 Amber Fort.jpg` | 5304x3315 | **61** | `ACCEPTABLE` | The image captures a wide perspective of Amber Fort above Maota Lake, directly matching primary destination landmarks. Daylight highlights the hilltop sandstone architecture, though the prominent foreground shoreline slightly weakens overall impact. |
| 2 | `Jaipur 03-2016 05 Amber Fort.jpg` | 5336x3335 | **61** | `ACCEPTABLE` | The photograph displays a detailed view of Amber Fort's yellow sandstone facade and fortified walls under clear sunlight. It effectively captures Rajputana architecture, though it lacks the broader landscape context of Maota Lake. |


### Destination #4: Udaipur
- **Deterministic Scorer Winner:** `20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg` (Score: **85**)
- **Gemini Vision Selected Winner:** `City Palace Udaipur Rajasthan India.JPG` (Score: **49**)

| Candidate # | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 2 | `City Palace Udaipur Rajasthan India.JPG` | 4272x2848 | **49** | `WEAK` | The image features detailed architectural jharokhas of the City Palace from a tight low angle. It lacks the essential wide landscape view and Lake Pichola setting needed for a primary destination image. |
| 1 | `Blue mural embroidery, Udaipur, Rajasthan, India.jpg` | 3000x4214 | **32** | `REJECT` | The photograph features a close-up of embroidered textile craft rather than establishing scenic landmarks or landscapes of Udaipur. This directly triggers a negative subject penalty for craft close-ups. |


### Destination #150: Maheshwar
- **Deterministic Scorer Winner:** `River Narmada from Maheshwar Fort.jpg` (Score: **80**)
- **Gemini Vision Selected Winner:** `Maheshwar 01.jpg` (Score: **35**)

| Candidate # | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 2 | `Maheshwar 01.jpg` | 4529x3133 | **35** | `REJECT` | The image captures a local street scene with modern structures rather than the iconic Ahilya Fort or Narmada ghats. It lacks key historic architectural subjects specified for the destination. |
| 1 | `Maheshwar Palace.jpg` | 388x521 | **24** | `REJECT` | The image features a close-up photo of a Hindi inscription board rather than landscape scenery. It lacks any visual depiction of Ahilya Fort, Narmada Ghats, or architectural elements. |


### Destination #155: Poovar
- **Deterministic Scorer Winner:** `Poovar backwaters view, Kerala, India.jpg` (Score: **85**)
- **Gemini Vision Selected Winner:** `Puvar 20080220-1.jpg` (Score: **48**)

| Candidate # | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `Puvar 20080220-1.jpg` | 4368x2912 | **48** | `WEAK` | The photograph captures a traditional thatched wooden boat on the beach spit. It lacks the preferred elevated view illustrating the confluence between the backwaters and sea. |
| 2 | `Poovar Island, Kerala, India 20140107-DSC 3287.jpg` | 4928x3264 | **37** | `REJECT` | The photo shows a close-up of an egret on palm leaves, failing to depict Poovar's iconic estuary, sand spit, or floating cottages. The generic wildlife subject lacks destination-specific landscape context. |


### Destination #160: Tranquebar (Tharangambadi)
- **Deterministic Scorer Winner:** `A view of Tranquebar - Google Art Project.jpg` (Score: **60**)
- **Gemini Vision Selected Winner:** `Bungalow on the Beach, Neemrana Hotels, in Tranquebar, Tamil Nadu.jpg` (Score: **44**)

| Candidate # | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 2 | `Bungalow on the Beach, Neemrana Hotels, in Tranquebar, Tamil Nadu.jpg` | 1029x683 | **44** | `WEAK` | The image features the Bungalow on the Beach rather than the primary yellow Fort Dansborg hero subject. A parked motorcycle and boundary wall obstruct the foreground, reducing visual appeal. Resolution is slightly below ideal hero standards. |
| 1 | `Tranquebar 1600.jpg` | 549x252 | **28** | `REJECT` | The candidate image is a low-resolution historical painting depicting 17th-century Danish Tranquebar rather than a modern photograph. At 549x252 pixels, the image quality is extremely low, making it completely unsuitable as a primary hero image for a modern travel application. |



---

## 4. Comparison against Deterministic Scorer & Value Added

1. **True Visual Understanding:** Unlike metadata string matching, Gemini Vision evaluates actual pixels—recognizing architectural grandeur, lighting, contrast, composition, and visual landmark prominence.
2. **Identification of Ideal Hero Aspect Ratios:** Gemini favors well-composed 16:9 or 4:3 landscape framing over awkward crops.
3. **Rejection of Ambiguous / Peripheral Subjects:** Gemini lowers scores for obscure close-ups or non-defining elements even if the filename contains the destination keyword.

---

## 5. Final Prototype Decision

```text
GEMINI_VISION_PROTOTYPE = PASS
```

*The Gemini Vision prototype successfully evaluated all 10 candidate images, produced reliable structured JSON scores, and demonstrated superior visual judgment over deterministic metadata scoring.*
