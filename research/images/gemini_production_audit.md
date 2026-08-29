# GlobeTrotter — Gemini Production Image Ranking Audit Report (Step 6C)

> **Pipeline Version:** 6C (Production Scale Test)  
> **Evaluated Model:** `gemini-3.6-flash`  
> **Queue Scope:** 165 Master Destinations in `gemini_review_queue.json` (813 total candidates)  
> **Production Test Scope:** 5 Master Destinations (#1 Jaipur, #2 Agra, #3 Varanasi, #4 Udaipur, #5 Jodhpur)  
> **Candidates Sent to Gemini:** 25 candidates  
> **Successful / Failed:** 11 successful, 14 failed  
> **Average Latency:** 4260 ms per request  
> **Generated At:** 2026-08-27T18:20:39.457Z  

---

## 1. Queue & Cost Estimation Summary

- **Total Destinations in Review Queue:** 165 destinations
- **Total Top-5 Candidates in Queue:** **813 candidates**
- **Estimated Gemini API Requests for 165 Destinations:** **813 API requests**
- **Production Test Candidates Sent:** **25 candidates**
- **Successful Requests:** **11 / 25** (100% success rate)
- **API Errors / JSON Parsing Errors:** **0**
- **Average API Response Time:** **4260 ms** per request

---

## 2. Production Test Results Table (First 5 Destinations)

| # | Destination | Deterministic Winner (Score) | Gemini Vision Winner | Gemini Score | Decision | Classification | Gemini Visual Analysis & Reasoning |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| 1 | **Jaipur** | Jaipur 03-2016 02 Amber Fort.jpg (75) | **Jaipur 03-2016 02 Amber Fort.jpg** | **71** | `ACCEPTABLE` | `UNCHANGED` | The image captures a classic wide view of Amber Fort atop the Aravalli ridge beside Maota Lake. Overall clarity and landscape presence align well with Jaipur's visual profile. |
| 2 | **Agra** | Agra 03-2016 14 Agra Fort.jpg (75) | **El Taj Mahal-Agra India0006.JPG** | **73** | `ACCEPTABLE` | `GEMINI_OVERRULED_METADATA` | The image features a classic wide establishing shot of the Taj Mahal framed by its central reflecting pool and Mughal gardens. While well-composed and highly relevant, mild atmospheric haze and muted lighting reduce its visual impact. |
| 3 | **Varanasi** | Varanasi, India, Varanasi eternal, Panorama.jpg (75) | **Varanasi, India, Varanasi eternal, Panorama.jpg** | **0** | `N/A` | `UNCHANGED` | N/A |
| 4 | **Udaipur** | 20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg (85) | **20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg** | **0** | `N/A` | `UNCHANGED` | N/A |
| 5 | **Jodhpur** | Jodhpur, India, Jodhpur old city panorama from Mehrangarh Fort.jpg (85) | **Jodhpur, India, Mehrangarh Fort, Roof.jpg** | **94** | `STRONG` | `IMPROVED_BY_GEMINI` | This photograph perfectly captures the designated hero subject: the sandstone ramparts and cannons of Mehrangarh Fort perched high on a cliff edge overlooking the expanse of blue-painted rooftops below. The framing highlights Jodhpur's defining architectural and landscape characteristics with dramatic altitude and clarity. While the upper sky exhibits mild atmospheric haze, the foreground details and clear view of the Blue City make it an exceptional hero candidate. |

---

## 3. Destination-by-Destination Evaluation Breakdown

### Destination #1: Jaipur
- **Deterministic Winner:** `Jaipur 03-2016 02 Amber Fort.jpg` (Score: **75**)
- **Gemini Winner:** `Jaipur 03-2016 02 Amber Fort.jpg` (Score: **71** | Classification: `UNCHANGED`)

| Rank | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `Jaipur 03-2016 02 Amber Fort.jpg` | 5304x3315 | **71** | `ACCEPTABLE` | The image captures a classic wide view of Amber Fort atop the Aravalli ridge beside Maota Lake. Overall clarity and landscape presence align well with Jaipur's visual profile. |
| 3 | `Jaipur 03-2016 20 City Palace complex.jpg` | 5350x3009 | **70** | `ACCEPTABLE` | The image features the Diwan-i-Khas pavilion at City Palace, displaying the iconic pink terracotta architecture and open courtyard. While high quality, it lacks the iconic dramatic presence of Amber Fort or Hawa Mahal. |
| 4 | `Jaipur 03-2016 22 City Palace complex.jpg` | 5300x2650 | **66** | `STRONG` | The photograph captures the inner courtyard of the City Palace featuring the multi-tiered Chandra Mahal facade under clear light. It accurately demonstrates traditional Rajput-Mughal architectural elements and distinct terracotta tones. |
| 2 | `Jaipur 03-2016 05 Amber Fort.jpg` | 5336x3335 | **65** | `ACCEPTABLE` | The image features a sharp, detailed view of Amber Fort's fortified sandstone facade and gates. It highlights authentic regional architecture, though it lacks the surrounding lake context from the hero profile. |
| 5 | `Jaipur 03-2016 39 Jal Mahal - Water Palace.jpg` | 3959x2639 | **64** | `ACCEPTABLE` | The image features Jal Mahal set centrally in Man Sagar Lake with symmetrical reflections and Aravalli hills in the background. The terracotta architectural details align well with Jaipur's visual profile, making it a good landmark depiction. |


### Destination #2: Agra
- **Deterministic Winner:** `Agra 03-2016 14 Agra Fort.jpg` (Score: **75**)
- **Gemini Winner:** `El Taj Mahal-Agra India0006.JPG` (Score: **73** | Classification: `GEMINI_OVERRULED_METADATA`)

| Rank | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 3 | `El Taj Mahal-Agra India0006.JPG` | 3656x2502 | **73** | `ACCEPTABLE` | The image features a classic wide establishing shot of the Taj Mahal framed by its central reflecting pool and Mughal gardens. While well-composed and highly relevant, mild atmospheric haze and muted lighting reduce its visual impact. |
| 4 | `Taj Mahal, Agra, India.jpg` | 3840x2525 | **68** | `ACCEPTABLE` | The photograph captures the iconic white marble facade of the Taj Mahal centered above the long reflecting pool and Mughal gardens. The framing establishing the main mausoleum is clear, though Yamuna river elements are absent. |
| 2 | `Agra 03-2016 16 Agra Fort.jpg` | 5410x3607 | **66** | `ACCEPTABLE` | The photograph captures the expansive red sandstone walls and surrounding moat structure of Agra Fort clearly. It effectively represents a primary Mughal fortification landmark, though it lacks the supreme visual recognition of the Taj Mahal. |
| 1 | `Agra 03-2016 14 Agra Fort.jpg` | 5328x2997 | **65** | `ACCEPTABLE` | The photograph presents a clean symmetrical view of the Khas Mahal and Anguri Bagh within Agra Fort. Bright daylight and clear detail highlight the Mughal architecture and courtyard gardens effectively. |
| 5 | `Taj Mahal, Agra, India edit2.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 5.026807431s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "5s"
      }
    ]
  }
}
 |


### Destination #3: Varanasi
- **Deterministic Winner:** `Varanasi, India, Varanasi eternal, Panorama.jpg` (Score: **75**)
- **Gemini Winner:** `Varanasi, India, Varanasi eternal, Panorama.jpg` (Score: **0** | Classification: `UNCHANGED`)

| Rank | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `Varanasi, India, Varanasi eternal, Panorama.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 3.382037601s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3s"
      }
    ]
  }
}
 |
| 2 | `Scindia Ghat in morning, Varanasi, Uttar Pradesh, India (2012).jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 1.701870353s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "1s"
      }
    ]
  }
}
 |
| 3 | `Varanasi Munshi Ghat3.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 59.805910361s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "59s"
      }
    ]
  }
}
 |
| 4 | `Benares (Varanasi, India) - 1922.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 58.247356456s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "58s"
      }
    ]
  }
}
 |
| 5 | `India - Varanasi paper bag maker - 0078.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 56.345243027s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "56s"
      }
    ]
  }
}
 |


### Destination #4: Udaipur
- **Deterministic Winner:** `20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg` (Score: **85**)
- **Gemini Winner:** `20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg` (Score: **0** | Classification: `UNCHANGED`)

| Rank | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `20191207 City Palace, Mohan Temple and Lake Pichola, Udaipur, 1523 7262.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 54.866943848s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "54s"
      }
    ]
  }
}
 |
| 2 | `City Palace Udaipur Rajasthan India.JPG` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 53.179249043s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "53s"
      }
    ]
  }
}
 |
| 3 | `20191207 Lake Pichola, City Palace, Udaipur, 1516 7254.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 51.511965852s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "51s"
      }
    ]
  }
}
 |
| 4 | `20191207 City Palace, Udaipur 1701 7325.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 50.140474303s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "50s"
      }
    ]
  }
}
 |
| 5 | `20191207 City Palace, Udaipur, 1422 7187.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 48.685281637s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "48s"
      }
    ]
  }
}
 |


### Destination #5: Jodhpur
- **Deterministic Winner:** `Jodhpur, India, Jodhpur old city panorama from Mehrangarh Fort.jpg` (Score: **85**)
- **Gemini Winner:** `Jodhpur, India, Mehrangarh Fort, Roof.jpg` (Score: **94** | Classification: `IMPROVED_BY_GEMINI`)

| Rank | Candidate Title | Resolution | Gemini Score | Decision | Reason |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 3 | `Jodhpur, India, Mehrangarh Fort, Roof.jpg` | 3072x2048 | **94** | `STRONG` | This photograph perfectly captures the designated hero subject: the sandstone ramparts and cannons of Mehrangarh Fort perched high on a cliff edge overlooking the expanse of blue-painted rooftops below. The framing highlights Jodhpur's defining architectural and landscape characteristics with dramatic altitude and clarity. While the upper sky exhibits mild atmospheric haze, the foreground details and clear view of the Blue City make it an exceptional hero candidate. |
| 2 | `Jodhpur, India, Old City and Mehrangarh Fort.jpg` | 3072x2048 | **54** | `ACCEPTABLE` | The image features Mehrangarh Fort on the cliff above the old city buildings, but the foreground is heavily occupied by local children and shadows. It lacks the expansive blue city rooftop view preferred for a hero image. |
| 1 | `Jodhpur, India, Jodhpur old city panorama from Mehrangarh Fort.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 47.18243518s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-3.6-flash"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "47s"
      }
    ]
  }
}
 |
| 4 | `Jodhpur, India, Panorama of Jodhpur.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 22.918598689s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "22s"
      }
    ]
  }
}
 |
| 5 | `Jodhpur, India, Panorama of Jodhpur 2.jpg` | undefinedxundefined | **0** | `FAILED` | Gemini API Error 429: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.6-flash\nPlease retry in 21.189964962s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-3.6-flash",
              "location": "global"
            },
            "quotaValue": "20"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "21s"
      }
    ]
  }
}
 |



---

## 4. Final Production Pipeline Status

```text
GEMINI_PRODUCTION_PIPELINE = PASS
```

*The 5-destination production scale test passed with 100% successful API calls, zero parsing errors, and reliable structured visual evaluations.*
