$sql = Get-Content "backend\src\main\resources\db\migration\V8__seed_200_indian_cities_and_activities.sql" -Raw;

# Parse Cities
$cityMatches = [regex]::Matches($sql, "\((\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([\d\.]+),\s*(\d+),\s*'([^']+)'\)");
$cities = @();
foreach ($m in $cityMatches) {
    $cities += [PSCustomObject]@{
        Id = [int]$m.Groups[1].Value
        Name = $m.Groups[2].Value
        Country = $m.Groups[3].Value
        Region = $m.Groups[4].Value
    }
}

# Parse Activities
$actMatches = [regex]::Matches($sql, "\((\d+),\s*'([^']+)',\s*'([^']*)',\s*'([^']+)',\s*(\d+),\s*([\d\.]+),\s*'([^']+)',\s*'([^']+)'\)");
$cityActivities = @{}
foreach ($c in $cities) { $cityActivities[$c.Id] = @() }
foreach ($m in $actMatches) {
    $cId = [int]$m.Groups[1].Value
    $aName = $m.Groups[2].Value
    if ($cityActivities.ContainsKey($cId)) {
        $cityActivities[$cId] += $aName
    }
}

$mapping = @{
    "Jaipur" = @{ Target = "Jaipur"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Agra" = @{ Target = "Agra"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Varanasi" = @{ Target = "Varanasi"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Udaipur" = @{ Target = "Udaipur"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Jodhpur" = @{ Target = "Jodhpur"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Jaisalmer" = @{ Target = "Jaisalmer"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Pushkar" = @{ Target = "Pushkar"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Manali" = @{ Target = "Manali"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Shimla" = @{ Target = "Shimla"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Rishikesh" = @{ Target = "Rishikesh"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Amritsar" = @{ Target = "Amritsar"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Leh" = @{ Target = "Ladakh"; Status = "MERGED"; Notes = "Tier 1: Consolidated into Ladakh" }
    "Srinagar" = @{ Target = "Srinagar"; Status = "CURATED"; Notes = "Tier 1: ⚠️ Only 3 activities in V8" }
    "Dharamshala" = @{ Target = "Dharamshala"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Mussoorie" = @{ Target = "Mussoorie"; Status = "CURATED"; Notes = "Tier 1: ⚠️ Only 3 activities in V8" }
    "Nainital" = @{ Target = "Nainital"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Haridwar" = @{ Target = "Haridwar"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Mathura" = @{ Target = "Mathura-Vrindavan"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Mathura-Vrindavan" }
    "Vrindavan" = @{ Target = "Mathura-Vrindavan"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Mathura-Vrindavan" }
    "Khajuraho" = @{ Target = "Khajuraho"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Alleppey" = @{ Target = "Alappuzha"; Status = "CURATED"; Notes = "Tier 1: Renamed to Alappuzha (Alias: Alleppey)" }
    "Munnar" = @{ Target = "Munnar"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Kochi" = @{ Target = "Kochi"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Mysore" = @{ Target = "Mysuru"; Status = "CURATED"; Notes = "Tier 1: Renamed to Mysuru (Alias: Mysore)" }
    "Hampi" = @{ Target = "Hampi"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Ooty" = @{ Target = "Ooty"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Pondicherry" = @{ Target = "Puducherry"; Status = "CURATED"; Notes = "Tier 1: Renamed to Puducherry (Alias: Pondicherry)" }
    "Madurai" = @{ Target = "Madurai"; Status = "CURATED"; Notes = "Tier 1: ⚠️ Only 3 activities in V8" }
    "Wayanad" = @{ Target = "Wayanad"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Coorg" = @{ Target = "Coorg"; Status = "CURATED"; Notes = "Tier 2: ⚠️ Only 3 activities in V8" }
    "Kanyakumari" = @{ Target = "Kanyakumari"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Trivandrum" = @{ Target = "Thiruvananthapuram"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Varkala" = @{ Target = "Varkala"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Kodaikanal" = @{ Target = "Kodaikanal"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Mahabalipuram" = @{ Target = "Mahabalipuram"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Chennai" = @{ Target = "Chennai"; Status = "CURATED"; Notes = "Tier 1: Major Metro" }
    "Hyderabad" = @{ Target = "Hyderabad"; Status = "CURATED"; Notes = "Tier 1: Major Metro" }
    "Bangalore" = @{ Target = "Bengaluru"; Status = "CURATED"; Notes = "Tier 1: Renamed to Bengaluru (Alias: Bangalore)" }
    "Gokarna" = @{ Target = "Gokarna"; Status = "CURATED"; Notes = "Tier 2: Authentic activities" }
    "Kolkata" = @{ Target = "Kolkata"; Status = "CURATED"; Notes = "Tier 1: Major Metro" }
    "Darjeeling" = @{ Target = "Darjeeling"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Gangtok" = @{ Target = "Gangtok"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Shillong" = @{ Target = "Shillong"; Status = "CURATED"; Notes = "Tier 1: Authentic activities" }
    "Cherrapunji" = @{ Target = "Cherrapunji (Sohra)"; Status = "CURATED"; Notes = "Tier 3: Renamed to Cherrapunji (Sohra)" }
    "Kaziranga" = @{ Target = "Kaziranga"; Status = "CURATED"; Notes = "Tier 1: National Park" }
    "Puri" = @{ Target = "Puri"; Status = "CURATED"; Notes = "Tier 1: Temple City" }
    "Bhubaneswar" = @{ Target = "Bhubaneswar"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Konark" = @{ Target = "Konark"; Status = "CURATED"; Notes = "Tier 3: Sun Temple" }
    "Mumbai" = @{ Target = "Mumbai"; Status = "CURATED"; Notes = "Tier 1: Major Metro" }
    "Pune" = @{ Target = "Pune"; Status = "CURATED"; Notes = "Tier 2: Major Hub" }
    "Lonavala" = @{ Target = "Lonavala-Khandala"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Lonavala-Khandala" }
    "Mahabaleshwar" = @{ Target = "Mahabaleshwar"; Status = "CURATED"; Notes = "Tier 2: Hill Station" }
    "Ahmedabad" = @{ Target = "Ahmedabad"; Status = "CURATED"; Notes = "Tier 2: UNESCO Heritage City" }
    "Rann of Kutch" = @{ Target = "Rann of Kutch"; Status = "CURATED"; Notes = "Tier 1: Desert Destination" }
    "Indore" = @{ Target = "Indore"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Bhopal" = @{ Target = "Bhopal"; Status = "CURATED"; Notes = "Tier 2: Regional Capital" }
    "Ujjain" = @{ Target = "Ujjain"; Status = "CURATED"; Notes = "Tier 1: Pilgrimage Center" }
    "Gwalior" = @{ Target = "Gwalior"; Status = "CURATED"; Notes = "Tier 2: Heritage Fort City" }
    "Orchha" = @{ Target = "Orchha"; Status = "CURATED"; Notes = "Tier 2: Heritage Fort Town" }
    "Pachmarhi" = @{ Target = "Pachmarhi"; Status = "CURATED"; Notes = "Tier 2: Hill Station" }
    "Lucknow" = @{ Target = "Lucknow"; Status = "CURATED"; Notes = "Tier 2: Awadh Heritage Hub" }
    "Ayodhya" = @{ Target = "Ayodhya"; Status = "CURATED"; Notes = "Tier 2: Pilgrimage Center" }
    "Prayagraj" = @{ Target = "Prayagraj"; Status = "CURATED"; Notes = "Tier 2: Sangam Pilgrimage" }
    "Chittorgarh" = @{ Target = "Chittorgarh"; Status = "CURATED"; Notes = "Tier 2: Heritage Fort" }
    "Bikaner" = @{ Target = "Bikaner"; Status = "CURATED"; Notes = "Tier 2: Desert Fort City" }
    "Mount Abu" = @{ Target = "Mount Abu"; Status = "CURATED"; Notes = "Tier 2: Hill Station" }
    "Ranthambore" = @{ Target = "Ranthambore"; Status = "CURATED"; Notes = "Tier 2: Tiger Sanctuary" }
    "Alwar" = @{ Target = "Alwar"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Kumbhalgarh" = @{ Target = "Kumbhalgarh"; Status = "SEARCH_ONLY"; Notes = "Secondary fort; retained for search" }
    "Bundi" = @{ Target = "Bundi"; Status = "CURATED"; Notes = "Tier 3: Heritage Fort Town" }
    "Chandigarh" = @{ Target = "Chandigarh"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Dalhousie" = @{ Target = "Dalhousie"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Kasauli" = @{ Target = "Kasauli"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Spiti Valley" = @{ Target = "Spiti Valley"; Status = "CURATED"; Notes = "Tier 2: Himalayan Valley" }
    "Auli" = @{ Target = "Auli"; Status = "CURATED"; Notes = "Tier 2: Ski Resort" }
    "Ranikhet" = @{ Target = "Ranikhet"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Almora" = @{ Target = "Almora"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Lansdowne" = @{ Target = "Lansdowne"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Gulmarg" = @{ Target = "Gulmarg"; Status = "CURATED"; Notes = "Tier 1: Ski & Alpine Resort" }
    "Pahalgam" = @{ Target = "Pahalgam"; Status = "CURATED"; Notes = "Tier 1: Valley Resort" }
    "Sonamarg" = @{ Target = "Sonamarg"; Status = "SEARCH_ONLY"; Notes = "Secondary valley; retained for search" }
    "Tawang" = @{ Target = "Tawang"; Status = "CURATED"; Notes = "Tier 3: Monastery Town" }
    "Guwahati" = @{ Target = "Guwahati"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Kohima" = @{ Target = "Kohima"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Imphal" = @{ Target = "Imphal"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Aizawl" = @{ Target = "Aizawl"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Agartala" = @{ Target = "Agartala"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Kalimpong" = @{ Target = "Kalimpong"; Status = "CURATED"; Notes = "Tier 3: Hill Station" }
    "Pelling" = @{ Target = "Pelling"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Majuli" = @{ Target = "Majuli"; Status = "CURATED"; Notes = "Tier 3: River Island" }
    "Ziro Valley" = @{ Target = "Ziro Valley"; Status = "CURATED"; Notes = "Tier 3: Tribal & Nature Valley" }
    "Port Blair" = @{ Target = "Andaman Islands"; Status = "MERGED"; Notes = "Tier 1: Consolidated into Andaman Islands" }
    "Havelock Island" = @{ Target = "Andaman Islands"; Status = "MERGED"; Notes = "Tier 1: Consolidated into Andaman Islands" }
    "Neil Island" = @{ Target = "Andaman Islands"; Status = "MERGED"; Notes = "Tier 1: Consolidated into Andaman Islands" }
    "Kavaratti" = @{ Target = "Lakshadweep"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Lakshadweep" }
    "Bangaram Island" = @{ Target = "Lakshadweep"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Lakshadweep" }
    "Nandi Hills" = @{ Target = "Nandi Hills"; Status = "SEARCH_ONLY"; Notes = "Secondary day trip; retained for search" }
    "Chikmagalur" = @{ Target = "Chikkamagaluru"; Status = "CURATED"; Notes = "Tier 2: Renamed to Chikkamagaluru" }
    "Bandipur" = @{ Target = "Bandipur"; Status = "CURATED"; Notes = "Tier 2: Tiger Reserve" }
    "Kabini" = @{ Target = "Nagarhole"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Nagarhole" }
    "Badami" = @{ Target = "Badami-Pattadakal"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Badami-Pattadakal" }
    "Pattadakal" = @{ Target = "Badami-Pattadakal"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Badami-Pattadakal" }
    "Aihole" = @{ Target = "Badami-Pattadakal"; Status = "MERGED"; Notes = "Tier 2: Consolidated into Badami-Pattadakal" }
    "Murudeshwar" = @{ Target = "Murudeshwar"; Status = "CURATED"; Notes = "Tier 3: Coastal Temple" }
    "Udupi" = @{ Target = "Udupi"; Status = "SEARCH_ONLY"; Notes = "Secondary temple town; retained for search" }
    "Dandeli" = @{ Target = "Dandeli"; Status = "CURATED"; Notes = "Tier 2: Adventure & Wildlife" }
    "Agumbe" = @{ Target = "Agumbe"; Status = "SEARCH_ONLY"; Notes = "Secondary rainforest; retained for search" }
    "Yercaud" = @{ Target = "Yercaud"; Status = "CURATED"; Notes = "Tier 3: Hill Station" }
    "Yelagiri" = @{ Target = "Yelagiri"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Valparai" = @{ Target = "Valparai"; Status = "CURATED"; Notes = "Tier 3: Hill Station" }
    "Chettinad" = @{ Target = "Chettinad"; Status = "CURATED"; Notes = "Tier 3: Heritage Mansions" }
    "Thanjavur" = @{ Target = "Thanjavur"; Status = "CURATED"; Notes = "Tier 2: Temple City" }
    "Rameshwaram" = @{ Target = "Rameswaram"; Status = "CURATED"; Notes = "Tier 1: Renamed to Rameswaram" }
    "Tirupati" = @{ Target = "Tirupati"; Status = "CURATED"; Notes = "Tier 1: Temple City" }
    "Vizag" = @{ Target = "Visakhapatnam"; Status = "CURATED"; Notes = "Tier 2: Renamed to Visakhapatnam (Alias: Vizag)" }
    "Araku Valley" = @{ Target = "Araku Valley"; Status = "CURATED"; Notes = "Tier 2: Hill Valley" }
    "Horsley Hills" = @{ Target = "Horsley Hills"; Status = "SEARCH_ONLY"; Notes = "Secondary hill station; retained for search" }
    "Warangal" = @{ Target = "Warangal"; Status = "SEARCH_ONLY"; Notes = "Secondary heritage city; retained for search" }
    "Vijayawada" = @{ Target = "Vijayawada"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Kakinada" = @{ Target = "Kakinada"; Status = "SEARCH_ONLY"; Notes = "Secondary port city; retained for search" }
    "Rajahmundry" = @{ Target = "Rajahmundry"; Status = "SEARCH_ONLY"; Notes = "Secondary river city; retained for search" }
    "Guntur" = @{ Target = "Guntur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Nellore" = @{ Target = "Nellore"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Anantapur" = @{ Target = "Anantapur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Kurnool" = @{ Target = "Kurnool"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Srikakulam" = @{ Target = "Srikakulam"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Eluru" = @{ Target = "Eluru"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Nizamabad" = @{ Target = "Nizamabad"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Khammam" = @{ Target = "Khammam"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Karimnagar" = @{ Target = "Karimnagar"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Ramagundam" = @{ Target = "Ramagundam"; Status = "SEARCH_ONLY"; Notes = "Secondary industrial city; retained for search" }
    "Mahbubnagar" = @{ Target = "Mahbubnagar"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Nalgonda" = @{ Target = "Nalgonda"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Adilabad" = @{ Target = "Adilabad"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Suryapet" = @{ Target = "Suryapet"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Jabalpur" = @{ Target = "Jabalpur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Kanha National Park" = @{ Target = "Kanha"; Status = "CURATED"; Notes = "Tier 2: National Park" }
    "Bandhavgarh National Park" = @{ Target = "Bandhavgarh"; Status = "CURATED"; Notes = "Tier 2: National Park" }
    "Pench National Park" = @{ Target = "Pench National Park"; Status = "SEARCH_ONLY"; Notes = "Secondary park; retained for search" }
    "Mandu" = @{ Target = "Mandu"; Status = "SEARCH_ONLY"; Notes = "Secondary fort town; retained for search" }
    "Raipur" = @{ Target = "Raipur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Jagdalpur" = @{ Target = "Jagdalpur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Bilaspur" = @{ Target = "Bilaspur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Korba" = @{ Target = "Korba"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Durg" = @{ Target = "Durg"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Cuttack" = @{ Target = "Cuttack"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Gopalpur" = @{ Target = "Gopalpur"; Status = "SEARCH_ONLY"; Notes = "Secondary beach town; retained for search" }
    "Daringbadi" = @{ Target = "Daringbadi"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town; retained for search" }
    "Sambalpur" = @{ Target = "Sambalpur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Rourkela" = @{ Target = "Rourkela"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Baripada" = @{ Target = "Baripada"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Digha" = @{ Target = "Digha"; Status = "SEARCH_ONLY"; Notes = "Secondary beach town; retained for search" }
    "Mandarmani" = @{ Target = "Mandarmani"; Status = "SEARCH_ONLY"; Notes = "Secondary beach town; retained for search" }
    "Sundarbans" = @{ Target = "Sundarbans"; Status = "CURATED"; Notes = "Tier 3: Mangrove Sanctuary" }
    "Shantiniketan" = @{ Target = "Shantiniketan"; Status = "SEARCH_ONLY"; Notes = "Secondary heritage town; retained for search" }
    "Bishnupur" = @{ Target = "Bishnupur"; Status = "SEARCH_ONLY"; Notes = "Secondary temple town; retained for search" }
    "Siliguri" = @{ Target = "Siliguri"; Status = "SEARCH_ONLY"; Notes = "Secondary transit city; retained for search" }
    "Murshidabad" = @{ Target = "Murshidabad"; Status = "SEARCH_ONLY"; Notes = "Secondary heritage town; retained for search" }
    "Bodh Gaya" = @{ Target = "Bodh Gaya"; Status = "CURATED"; Notes = "Tier 1: UNESCO Pilgrimage Site" }
    "Patna" = @{ Target = "Patna"; Status = "SEARCH_ONLY"; Notes = "Secondary capital city; retained for search" }
    "Nalanda" = @{ Target = "Nalanda"; Status = "SEARCH_ONLY"; Notes = "Secondary archaeological site; retained for search" }
    "Rajgir" = @{ Target = "Rajgir"; Status = "SEARCH_ONLY"; Notes = "Secondary pilgrimage town; retained for search" }
    "Vaishali" = @{ Target = "Vaishali"; Status = "SEARCH_ONLY"; Notes = "Secondary heritage town; retained for search" }
    "Bhagalpur" = @{ Target = "Bhagalpur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Gaya" = @{ Target = "Gaya"; Status = "SEARCH_ONLY"; Notes = "Secondary pilgrimage city; retained for search" }
    "Ranchi" = @{ Target = "Ranchi"; Status = "SEARCH_ONLY"; Notes = "Secondary capital city; retained for search" }
    "Netarhat" = @{ Target = "Netarhat"; Status = "SEARCH_ONLY"; Notes = "Secondary hill station; retained for search" }
    "Deoghar" = @{ Target = "Deoghar"; Status = "SEARCH_ONLY"; Notes = "Secondary pilgrimage city; retained for search" }
    "Jamshedpur" = @{ Target = "Jamshedpur"; Status = "SEARCH_ONLY"; Notes = "Secondary industrial city; retained for search" }
    "Dhanbad" = @{ Target = "Dhanbad"; Status = "SEARCH_ONLY"; Notes = "Secondary industrial city; retained for search" }
    "Hazaribagh" = @{ Target = "Hazaribagh"; Status = "SEARCH_ONLY"; Notes = "Secondary town; retained for search" }
    "Shirdi" = @{ Target = "Shirdi"; Status = "SEARCH_ONLY"; Notes = "Secondary pilgrimage town; retained for search" }
    "Nashik" = @{ Target = "Nashik"; Status = "CURATED"; Notes = "Tier 2: Wine & Religious Hub" }
    "Aurangabad" = @{ Target = "Chhatrapati Sambhajinagar"; Status = "CURATED"; Notes = "Tier 2: Renamed to Chhatrapati Sambhajinagar" }
    "Alibaug" = @{ Target = "Alibaug"; Status = "CURATED"; Notes = "Tier 2: Coastal Resort" }
    "Panchgani" = @{ Target = "Panchgani"; Status = "SEARCH_ONLY"; Notes = "Secondary hill station; retained for search" }
    "Matheran" = @{ Target = "Matheran"; Status = "CURATED"; Notes = "Tier 3: Vehicle-free Hill Station" }
    "Lavasa" = @{ Target = "Lavasa"; Status = "SEARCH_ONLY"; Notes = "Secondary hill resort; retained for search" }
    "Ganpatipule" = @{ Target = "Ganpatipule"; Status = "SEARCH_ONLY"; Notes = "Secondary beach town; retained for search" }
    "Tarkarli" = @{ Target = "Tarkarli"; Status = "CURATED"; Notes = "Tier 3: Coastal Water Sports" }
    "Kohlapur" = @{ Target = "Kolhapur"; Status = "SEARCH_ONLY"; Notes = "Secondary heritage city (Kolhapur); retained for search" }
    "Solapur" = @{ Target = "Solapur"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Satara" = @{ Target = "Satara"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Ratnagiri" = @{ Target = "Ratnagiri"; Status = "SEARCH_ONLY"; Notes = "Secondary coastal town; retained for search" }
    "Karjad" = @{ Target = "Karjat"; Status = "SEARCH_ONLY"; Notes = "Secondary hill town (Karjat); retained for search" }
    "Dwarka" = @{ Target = "Dwarka"; Status = "CURATED"; Notes = "Tier 2: Pilgrimage Center" }
    "Somnath" = @{ Target = "Somnath"; Status = "CURATED"; Notes = "Tier 2: Temple Center" }
    "Gir National Park" = @{ Target = "Gir"; Status = "CURATED"; Notes = "Tier 2: Lion Sanctuary" }
    "Vadodara" = @{ Target = "Vadodara"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Surat" = @{ Target = "Surat"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Bhuj" = @{ Target = "Bhuj"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Statue of Unity" = @{ Target = "Statue of Unity"; Status = "CURATED"; Notes = "Tier 1: Kevadia Monument" }
    "Saputara" = @{ Target = "Saputara"; Status = "CURATED"; Notes = "Tier 3: Hill Station" }
    "Junagadh" = @{ Target = "Junagadh"; Status = "SEARCH_ONLY"; Notes = "Secondary fort city; retained for search" }
    "Jamnagar" = @{ Target = "Jamnagar"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Bhavnagar" = @{ Target = "Bhavnagar"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Gandhinagar" = @{ Target = "Gandhinagar"; Status = "SEARCH_ONLY"; Notes = "Secondary capital city; retained for search" }
    "Porbandar" = @{ Target = "Porbandar"; Status = "SEARCH_ONLY"; Notes = "Secondary coastal town; retained for search" }
    "Anand" = @{ Target = "Anand"; Status = "SEARCH_ONLY"; Notes = "Secondary city; retained for search" }
    "Silvassa" = @{ Target = "Silvassa"; Status = "SEARCH_ONLY"; Notes = "Secondary territory capital; retained for search" }
}

$newDestinationsList = @(
    "Delhi", "Goa", "Kerala", "Ajmer", "Sarnath", "Bhedaghat", "Diu", "Champaner-Pavagadh", 
    "Ajanta Caves", "Ellora Caves", "Thekkady-Periyar", "Kumarakom", "Kanchipuram", "Sanchi", 
    "Omkareshwar", "Kedarnath", "Badrinath", "Vaishno Devi", "Lakshadweep", "Jim Corbett", 
    "Valley of Flowers", "Shekhawati", "Ranakpur", "Dholavira", "Modhera-Patan", "Bhimashankar", 
    "Lonar", "Sakleshpur", "Bekal", "Vagamon", "Kozhikode", "Kannur", "Pichavaram", "Chilika Lake", "Manas"
)

# Output Markdown File
$md = @"
# GlobeTrotter Destination Catalog Migration Audit (Phase 1)

> **Document Status:** Complete Deterministic Audit  
> **Scope:** Mapping 200 seed destinations from `V8__seed_200_indian_cities_and_activities.sql` to the target **137 Curated Destinations Catalog Architecture**.  
> **Safety Guarantee:** Zero database changes, zero entity edits, zero code mutations.

---

## 1. Executive Summary & Reconciliation Math

The migration model classifies every existing and target destination into one of four conceptual statuses:
- **`CURATED`**: Destination belongs directly to the primary 137 curated GlobeTrotter catalog.
- **`MERGED`**: Existing V8 entry is consolidated into a unified target curated destination (e.g. Leh $\rightarrow$ Ladakh, Port Blair/Havelock/Neil $\rightarrow$ Andaman Islands).
- **`SEARCH_ONLY`**: Existing V8 entry is preserved in the database to protect trip history and searchability, but removed from the primary curated catalog grid.
- **`NEW`**: Target curated destination not present in V8 that will be added to the catalog.

### Exact Reconciliation Math

| Category | Count | Formula / Reconciliation |
| :--- | :---: | :--- |
| **Total Existing V8 Seed Destinations** | **200** | $95 \text{ (CURATED)} + 13 \text{ (MERGED)} + 92 \text{ (SEARCH\_ONLY)} = \mathbf{200}$ |
| **Existing V8 Mapped to CURATED (Direct)** | **95** | Direct 1-to-1 match in target catalog |
| **Existing V8 Mapped to MERGED** | **13** | Consolidates into **7** unified target curated destinations |
| **Existing V8 Mapped to SEARCH_ONLY** | **92** | Preserved for DB foreign key safety & search fallback |
| **Unique Target Catalog Covered by V8** | **102** | $95 \text{ (Direct CURATED)} + 7 \text{ (Unified MERGED targets)} = \mathbf{102}$ |
| **NEW Destinations to Add** | **35** | Added to complete the target catalog |
| **TOTAL TARGET CURATED CATALOG** | **137** | $\mathbf{102 \text{ (Covered from V8)}} + \mathbf{35 \text{ (NEW)}} = \mathbf{137}$ |

---

## 2. Complete 200 V8 Destinations Audit Table

Below is the complete audit of all 200 existing destinations from `V8__seed_200_indian_cities_and_activities.sql`:

| Existing ID | Existing V8 Name | Target Destination | Status | Activity Count | Existing Activity Names | Notes & Normalization |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
"@

foreach ($c in $cities) {
    $info = $mapping[$c.Name]
    $acts = $cityActivities[$c.Id]
    $actCount = $acts.Count
    $actStr = ($acts -join "; ")
    $status = $info.Status
    $target = $info.Target
    $notes = $info.Notes

    $md += "`n| ``$($c.Id)`` | $($c.Name) | **$target** | ``$status`` | $actCount | $actStr | $notes |"
}

$md += @"


---

## 3. Detailed Breakdown by Status

### A. MERGED Destinations (13 V8 Entries $\rightarrow$ 7 Unified Targets)

1. **Leh** (`ID 12`) $\rightarrow$ Merged into **Ladakh** (Unified Tier 1 Destination)
   - *Moved Activities:* Stok Kangri Trek, Leh Palace Tour, Shanti Stupa Walk, Hall of Fame Visit
2. **Mathura** (`ID 18`) & **Vrindavan** (`ID 19`) $\rightarrow$ Merged into **Mathura-Vrindavan** (Unified Tier 2 Destination)
   - *Moved Activities:* Dwarkadhish Temple, Krishna Janmabhoomi, Prem Mandir, Banke Bihari Temple
3. **Port Blair** (`ID 92`), **Havelock Island** (`ID 93`), **Neil Island** (`ID 94`) $\rightarrow$ Merged into **Andaman Islands** (Unified Tier 1 Destination)
   - *Moved Activities:* Cellular Jail, Radhanagar Beach Sunset, Scuba Diving, Lakshmanpur Beach
4. **Kavaratti** (`ID 95`) & **Bangaram Island** (`ID 96`) $\rightarrow$ Merged into **Lakshadweep** (Unified Tier 2 Destination)
   - *Moved Activities:* Kavaratti Lagoon Kayaking, Bangaram Scuba Diving
5. **Kabini** (`ID 100`) $\rightarrow$ Merged into **Nagarhole** (Unified Tier 2 Destination)
   - *Moved Activities:* Kabini River Safari, Nagarhole Jungle Trek
6. **Badami** (`ID 101`), **Pattadakal** (`ID 102`), **Aihole** (`ID 103`) $\rightarrow$ Merged into **Badami-Pattadakal** (Unified Tier 2 Destination)
   - *Moved Activities:* Badami Cave Temples, Pattadakal UNESCO Complex, Durga Temple Aihole
7. **Lonavala** (`ID 51`) $\rightarrow$ Merged into **Lonavala-Khandala** (Unified Tier 2 Destination)
   - *Moved Activities:* Tiger's Leap Viewpoint, Bhaja Caves & Fort Stroll

---

### B. NEW Destinations to Add (35 Target Catalog Items Not in V8)

| # | Destination Name | Target Tier | Circuit / Category |
| :---: | :--- | :---: | :--- |
1 | **Delhi** | Tier 1 | Golden Triangle Capital Metro |
2 | **Goa** | Tier 1 | Coastal & Heritage Haven |
3 | **Kerala** | Tier 1 | Backwaters & Western Ghats Region |
4 | **Ajmer** | Tier 2 | Dargah Sharif & Taragarh Heritage |
5 | **Sarnath** | Tier 2 | Spun out from Varanasi (Buddhist Pilgrimage) |
6 | **Bhedaghat** | Tier 2 | Marble Rocks & Dhuandhar Falls (MP) |
7 | **Diu** | Tier 2 | Portuguese Island Fort & Coastal Haven |
8 | **Champaner-Pavagadh** | Tier 2 | UNESCO World Heritage Complex (Gujarat) |
9 | **Ajanta Caves** | Tier 2 | UNESCO Rock-Cut Buddhist Monuments |
10 | **Ellora Caves** | Tier 2 | UNESCO Rock-Cut Monolithic Caves |
11 | **Thekkady-Periyar** | Tier 2 | Elephant Reserve & Spice Plantations |
12 | **Kumarakom** | Tier 2 | Vembanad Lake Bird Sanctuary & Backwaters |
13 | **Kanchipuram** | Tier 2 | Silk & Temple Heritage City |
14 | **Sanchi** | Tier 2 | UNESCO Great Stupa Buddhist Complex |
15 | **Omkareshwar** | Tier 2 | Jyotirlinga Island Temple |
16 | **Kedarnath** | Tier 2 | Sacred Char Dham Himalayan Shrine |
17 | **Badrinath** | Tier 2 | Sacred Char Dham Himalayan Shrine |
18 | **Vaishno Devi** | Tier 2 | Sacred Cave Shrine (Katra, J&K) |
19 | **Lakshadweep** | Tier 2 | Coral Archipelago (Consolidated) |
20 | **Jim Corbett** | Tier 2 | Oldest National Park Tiger Reserve |
21 | **Valley of Flowers** | Tier 2 | UNESCO Alpine Floral Sanctuary |
22 | **Shekhawati** | Tier 3 | Open-Air Painted Haveli Gallery |
23 | **Ranakpur** | Tier 3 | 1444-Pillar Marble Jain Temple |
24 | **Dholavira** | Tier 3 | UNESCO Harappan Metropolis in Kutch |
25 | **Modhera-Patan** | Tier 3 | Sun Temple & Rani ki Vav Stepwell |
26 | **Bhimashankar** | Tier 3 | Jyotirlinga Western Ghats Sanctuary |
27 | **Lonar** | Tier 3 | Meteorite Impact Crater Lake |
28 | **Sakleshpur** | Tier 3 | Western Ghats Coffee Trail |
29 | **Bekal** | Tier 3 | Coastal Keyhole Fort |
30 | **Vagamon** | Tier 3 | Pine Forests & Grassland Meadows |
31 | **Kozhikode** | Tier 3 | Malabar Spice Coast & Culinary Hub |
32 | **Kannur** | Tier 3 | Theyyam Tradition & Theyyam Beaches |
33 | **Pichavaram** | Tier 3 | World's 2nd Largest Mangrove Forest |
34 | **Chilika Lake** | Tier 3 | Asia's Largest Brackish Water Lagoon |
35 | **Manas** | Tier 3 | UNESCO Wildlife Sanctuary (Assam) |

---

### C. SEARCH_ONLY Destinations (92 V8 Entries Retained for DB Integrity)

The following 92 existing V8 destinations will remain in the `cities` database table with `status = 'SEARCH_ONLY'` so that existing user trip stops, foreign key relationships, and global search fallbacks remain 100% functional without breaking schema constraints:

*Trivandrum, Bhubaneswar, Indore, Alwar, Kumbhalgarh, Chandigarh, Dalhousie, Kasauli, Ranikhet, Almora, Lansdowne, Sonamarg, Guwahati, Kohima, Imphal, Aizawl, Agartala, Pelling, Nandi Hills, Udupi, Agumbe, Yelagiri, Horsley Hills, Warangal, Vijayawada, Kakinada, Rajahmundry, Guntur, Nellore, Anantapur, Kurnool, Srikakulam, Eluru, Nizamabad, Khammam, Karimnagar, Ramagundam, Mahbubnagar, Nalgonda, Adilabad, Suryapet, Jabalpur, Pench National Park, Mandu, Raipur, Jagdalpur, Bilaspur, Korba, Durg, Cuttack, Gopalpur, Daringbadi, Sambalpur, Rourkela, Baripada, Digha, Mandarmani, Shantiniketan, Bishnupur, Siliguri, Murshidabad, Patna, Nalanda, Rajgir, Vaishali, Bhagalpur, Gaya, Ranchi, Netarhat, Deoghar, Jamshedpur, Dhanbad, Hazaribagh, Shirdi, Panchgani, Lavasa, Ganpatipule, Kohlapur (Kolhapur), Solapur, Satara, Ratnagiri, Karjad (Karjat), Vadodara, Surat, Bhuj, Junagadh, Jamnagar, Bhavnagar, Gandhinagar, Porbandar, Anand, Silvassa.*

---

## 4. Activity Audit Findings & Anomalies

### 1. Activity Count Deficits (< 4 activities)
- **Srinagar** (`ID 13`): 3 activities (*Dal Lake Shikara, Mughal Gardens, Shankaracharya Temple*)
- **Mussoorie** (`ID 15`): 3 activities (*Kempty Falls, Gun Hill Ropeway, Mall Road*)
- **Madurai** (`ID 28`): 3 activities (*Meenakshi Amman Temple, Thirumalai Nayakkar Palace, Gandhi Memorial*)
- **Coorg** (`ID 30`): 3 activities (*Abbey Falls, Raja's Seat, Dubare Elephant Camp*)
*Action Item:* Add 1 authentic activity to each of these 4 cities during Phase 2 to meet the minimum threshold of 4.

### 2. Misplaced / Cross-Destination POIs in V8
- **Sarnath**: Currently listed as an activity under Varanasi (`ID 3`). Can remain an activity or be cross-referenced to Sarnath destination (`NEW`).
- **Fatehpur Sikri**: Listed as an activity under Agra (`ID 2`) — appropriate as a day trip activity.
- **Elephanta Caves**: Listed under Mumbai (`ID 49`) — appropriate as a boat trip activity.
- **Ajanta & Ellora Caves**: Currently listed as generic activities under Aurangabad (`ID 174`) — under the target catalog, Chhatrapati Sambhajinagar is the urban hub while Ajanta Caves and Ellora Caves are distinct Tier 2 destinations.

---

## 5. Summary & Readiness Confirmation

- **Phase 1 Audit Complete:** All 200 V8 destinations mapped and reconciled to the 137 curated destination architecture.
- **Safety Check:** No SQL scripts executed, no Java files edited, no migrations added, no DB rows deleted.
- **Next Step:** Ready for user review and approval before proceeding to Phase 2 (DB Schema Extension & Migration Scripting).
"@

Set-Content -Path "destination_migration_audit.md" -Value $md -Encoding utf8
Write-Host "Created destination_migration_audit.md successfully."
