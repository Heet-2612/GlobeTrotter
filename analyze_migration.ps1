 = Get-Content "backend\src\main\resources\db\migration\V8__seed_200_indian_cities_and_activities.sql" -Raw;

# Parse Cities
 = [regex]::Matches(, "\((\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([\d\.]+),\s*(\d+),\s*'([^']+)'\)");
 = @();
foreach ( in ) {
     += [PSCustomObject]@{
        Id = [int].Groups[1].Value
        Name = .Groups[2].Value
        Country = .Groups[3].Value
        Region = .Groups[4].Value
    }
}

# Parse Activities
 = [regex]::Matches(, "\((\d+),\s*'([^']+)',\s*'([^']*)',\s*'([^']+)',\s*(\d+),\s*([\d\.]+),\s*'([^']+)',\s*'([^']+)'\)");
 = @{}
foreach ( in ) { [.Id] = @() }
foreach ( in ) {
     = [int].Groups[1].Value
     = .Groups[2].Value
    if (.ContainsKey()) {
        [] += 
    }
}

# 137 Curated Destinations
 = @(
    "Delhi","Agra","Jaipur","Udaipur","Jodhpur","Jaisalmer","Varanasi","Goa","Mumbai","Kerala","Kochi","Alappuzha","Munnar","Rishikesh","Haridwar","Mussoorie","Nainital","Shimla","Manali","Dharamshala","Srinagar","Gulmarg","Pahalgam","Ladakh","Amritsar","Kolkata","Chennai","Bengaluru","Hyderabad","Puducherry","Ooty","Mysuru","Hampi","Madurai","Tirupati","Rameswaram","Darjeeling","Gangtok","Shillong","Kaziranga","Andaman Islands","Ujjain","Bodh Gaya","Puri","Rann of Kutch","Statue of Unity",
    "Bhopal","Ranthambore","Pushkar","Ajmer","Chittorgarh","Bikaner","Mount Abu","Mathura–Vrindavan","Ayodhya","Sarnath","Lucknow","Prayagraj","Khajuraho","Orchha","Gwalior","Bhedaghat","Kanha","Bandhavgarh","Pachmarhi","Ahmedabad","Dwarka","Somnath","Gir","Diu","Champaner–Pavagadh","Pune","Chhatrapati Sambhajinagar","Ajanta Caves","Ellora Caves","Lonavala–Khandala","Mahabaleshwar","Alibaug","Gokarna","Coorg","Chikkamagaluru","Badami–Pattadakal","Dandeli","Nagarhole","Bandipur","Varkala","Wayanad","Thekkady–Periyar","Kumarakom","Kodaikanal","Mahabalipuram","Thanjavur","Kanchipuram","Kanyakumari","Visakhapatnam","Araku Valley","Sanchi","Omkareshwar","Kedarnath","Badrinath","Vaishno Devi","Lakshadweep","Nashik","Jim Corbett","Valley of Flowers","Spiti Valley","Auli",
    "Bundi","Shekhawati","Ranakpur","Dholavira","Modhera–Patan","Saputara","Matheran","Tarkarli","Bhimashankar","Lonar","Sakleshpur","Murudeshwar","Bekal","Vagamon","Kozhikode","Kannur","Yercaud","Valparai","Chettinad","Pichavaram","Konark","Chilika Lake","Sundarbans","Kalimpong","Majuli","Manas","Tawang","Ziro Valley","Cherrapunji (Sohra)","Dawki"
)

Write-Host "Target Curated Count: 0"

# Mapping Rules for V8 Cities
# Status: CURATED, MERGED, SEARCH_ONLY
# Maps City -> Target Destination & Status

 = @{
    "Jaipur" = @{ Target = "Jaipur"; Status = "CURATED" }
    "Agra" = @{ Target = "Agra"; Status = "CURATED" }
    "Varanasi" = @{ Target = "Varanasi"; Status = "CURATED" }
    "Udaipur" = @{ Target = "Udaipur"; Status = "CURATED" }
    "Jodhpur" = @{ Target = "Jodhpur"; Status = "CURATED" }
    "Jaisalmer" = @{ Target = "Jaisalmer"; Status = "CURATED" }
    "Pushkar" = @{ Target = "Pushkar"; Status = "CURATED" }
    "Manali" = @{ Target = "Manali"; Status = "CURATED" }
    "Shimla" = @{ Target = "Shimla"; Status = "CURATED" }
    "Rishikesh" = @{ Target = "Rishikesh"; Status = "CURATED" }
    "Amritsar" = @{ Target = "Amritsar"; Status = "CURATED" }
    "Leh" = @{ Target = "Ladakh"; Status = "MERGED" }
    "Srinagar" = @{ Target = "Srinagar"; Status = "CURATED" }
    "Dharamshala" = @{ Target = "Dharamshala"; Status = "CURATED" }
    "Mussoorie" = @{ Target = "Mussoorie"; Status = "CURATED" }
    "Nainital" = @{ Target = "Nainital"; Status = "CURATED" }
    "Haridwar" = @{ Target = "Haridwar"; Status = "CURATED" }
    "Mathura" = @{ Target = "Mathura–Vrindavan"; Status = "MERGED" }
    "Vrindavan" = @{ Target = "Mathura–Vrindavan"; Status = "MERGED" }
    "Khajuraho" = @{ Target = "Khajuraho"; Status = "CURATED" }
    "Alleppey" = @{ Target = "Alappuzha"; Status = "CURATED" } # Renamed
    "Munnar" = @{ Target = "Munnar"; Status = "CURATED" }
    "Kochi" = @{ Target = "Kochi"; Status = "CURATED" }
    "Mysore" = @{ Target = "Mysuru"; Status = "CURATED" } # Renamed
    "Hampi" = @{ Target = "Hampi"; Status = "CURATED" }
    "Ooty" = @{ Target = "Ooty"; Status = "CURATED" }
    "Pondicherry" = @{ Target = "Puducherry"; Status = "CURATED" } # Renamed
    "Madurai" = @{ Target = "Madurai"; Status = "CURATED" }
    "Wayanad" = @{ Target = "Wayanad"; Status = "CURATED" }
    "Coorg" = @{ Target = "Coorg"; Status = "CURATED" }
    "Kanyakumari" = @{ Target = "Kanyakumari"; Status = "CURATED" }
    "Trivandrum" = @{ Target = "Thiruvananthapuram"; Status = "SEARCH_ONLY" }
    "Varkala" = @{ Target = "Varkala"; Status = "CURATED" }
    "Kodaikanal" = @{ Target = "Kodaikanal"; Status = "CURATED" }
    "Mahabalipuram" = @{ Target = "Mahabalipuram"; Status = "CURATED" }
    "Chennai" = @{ Target = "Chennai"; Status = "CURATED" }
    "Hyderabad" = @{ Target = "Hyderabad"; Status = "CURATED" }
    "Bangalore" = @{ Target = "Bengaluru"; Status = "CURATED" } # Renamed
    "Gokarna" = @{ Target = "Gokarna"; Status = "CURATED" }
    "Kolkata" = @{ Target = "Kolkata"; Status = "CURATED" }
    "Darjeeling" = @{ Target = "Darjeeling"; Status = "CURATED" }
    "Gangtok" = @{ Target = "Gangtok"; Status = "CURATED" }
    "Shillong" = @{ Target = "Shillong"; Status = "CURATED" }
    "Cherrapunji" = @{ Target = "Cherrapunji (Sohra)"; Status = "CURATED" } # Renamed
    "Kaziranga" = @{ Target = "Kaziranga"; Status = "CURATED" }
    "Puri" = @{ Target = "Puri"; Status = "CURATED" }
    "Bhubaneswar" = @{ Target = "Bhubaneswar"; Status = "SEARCH_ONLY" }
    "Konark" = @{ Target = "Konark"; Status = "CURATED" }
    "Mumbai" = @{ Target = "Mumbai"; Status = "CURATED" }
    "Pune" = @{ Target = "Pune"; Status = "CURATED" }
    "Lonavala" = @{ Target = "Lonavala–Khandala"; Status = "MERGED" }
    "Mahabaleshwar" = @{ Target = "Mahabaleshwar"; Status = "CURATED" }
    "Ahmedabad" = @{ Target = "Ahmedabad"; Status = "CURATED" }
    "Rann of Kutch" = @{ Target = "Rann of Kutch"; Status = "CURATED" }
    "Indore" = @{ Target = "Indore"; Status = "SEARCH_ONLY" }
    "Bhopal" = @{ Target = "Bhopal"; Status = "CURATED" }
    "Ujjain" = @{ Target = "Ujjain"; Status = "CURATED" }
    "Gwalior" = @{ Target = "Gwalior"; Status = "CURATED" }
    "Orchha" = @{ Target = "Orchha"; Status = "CURATED" }
    "Pachmarhi" = @{ Target = "Pachmarhi"; Status = "CURATED" }
    "Lucknow" = @{ Target = "Lucknow"; Status = "CURATED" }
    "Ayodhya" = @{ Target = "Ayodhya"; Status = "CURATED" }
    "Prayagraj" = @{ Target = "Prayagraj"; Status = "CURATED" }
    "Chittorgarh" = @{ Target = "Chittorgarh"; Status = "CURATED" }
    "Bikaner" = @{ Target = "Bikaner"; Status = "CURATED" }
    "Mount Abu" = @{ Target = "Mount Abu"; Status = "CURATED" }
    "Ranthambore" = @{ Target = "Ranthambore"; Status = "CURATED" }
    "Alwar" = @{ Target = "Alwar"; Status = "SEARCH_ONLY" }
    "Kumbhalgarh" = @{ Target = "Kumbhalgarh"; Status = "SEARCH_ONLY" }
    "Bundi" = @{ Target = "Bundi"; Status = "CURATED" }
    "Chandigarh" = @{ Target = "Chandigarh"; Status = "SEARCH_ONLY" }
    "Dalhousie" = @{ Target = "Dalhousie"; Status = "SEARCH_ONLY" }
    "Kasauli" = @{ Target = "Kasauli"; Status = "SEARCH_ONLY" }
    "Spiti Valley" = @{ Target = "Spiti Valley"; Status = "CURATED" }
    "Auli" = @{ Target = "Auli"; Status = "CURATED" }
    "Ranikhet" = @{ Target = "Ranikhet"; Status = "SEARCH_ONLY" }
    "Almora" = @{ Target = "Almora"; Status = "SEARCH_ONLY" }
    "Lansdowne" = @{ Target = "Lansdowne"; Status = "SEARCH_ONLY" }
    "Gulmarg" = @{ Target = "Gulmarg"; Status = "CURATED" }
    "Pahalgam" = @{ Target = "Pahalgam"; Status = "CURATED" }
    "Sonamarg" = @{ Target = "Sonamarg"; Status = "SEARCH_ONLY" }
    "Tawang" = @{ Target = "Tawang"; Status = "CURATED" }
    "Guwahati" = @{ Target = "Guwahati"; Status = "SEARCH_ONLY" }
    "Kohima" = @{ Target = "Kohima"; Status = "SEARCH_ONLY" }
    "Imphal" = @{ Target = "Imphal"; Status = "SEARCH_ONLY" }
    "Aizawl" = @{ Target = "Aizawl"; Status = "SEARCH_ONLY" }
    "Agartala" = @{ Target = "Agartala"; Status = "SEARCH_ONLY" }
    "Kalimpong" = @{ Target = "Kalimpong"; Status = "CURATED" }
    "Pelling" = @{ Target = "Pelling"; Status = "SEARCH_ONLY" }
    "Majuli" = @{ Target = "Majuli"; Status = "CURATED" }
    "Ziro Valley" = @{ Target = "Ziro Valley"; Status = "CURATED" }
    "Port Blair" = @{ Target = "Andaman Islands"; Status = "MERGED" }
    "Havelock Island" = @{ Target = "Andaman Islands"; Status = "MERGED" }
    "Neil Island" = @{ Target = "Andaman Islands"; Status = "MERGED" }
    "Kavaratti" = @{ Target = "Lakshadweep"; Status = "MERGED" }
    "Bangaram Island" = @{ Target = "Lakshadweep"; Status = "MERGED" }
    "Nandi Hills" = @{ Target = "Nandi Hills"; Status = "SEARCH_ONLY" }
    "Chikmagalur" = @{ Target = "Chikkamagaluru"; Status = "CURATED" } # Renamed
    "Bandipur" = @{ Target = "Bandipur"; Status = "CURATED" }
    "Kabini" = @{ Target = "Nagarhole"; Status = "MERGED" }
    "Badami" = @{ Target = "Badami–Pattadakal"; Status = "MERGED" }
    "Pattadakal" = @{ Target = "Badami–Pattadakal"; Status = "MERGED" }
    "Aihole" = @{ Target = "Badami–Pattadakal"; Status = "MERGED" }
    "Murudeshwar" = @{ Target = "Murudeshwar"; Status = "CURATED" }
    "Udupi" = @{ Target = "Udupi"; Status = "SEARCH_ONLY" }
    "Dandeli" = @{ Target = "Dandeli"; Status = "CURATED" }
    "Agumbe" = @{ Target = "Agumbe"; Status = "SEARCH_ONLY" }
    "Yercaud" = @{ Target = "Yercaud"; Status = "CURATED" }
    "Yelagiri" = @{ Target = "Yelagiri"; Status = "SEARCH_ONLY" }
    "Valparai" = @{ Target = "Valparai"; Status = "CURATED" }
    "Chettinad" = @{ Target = "Chettinad"; Status = "CURATED" }
    "Thanjavur" = @{ Target = "Thanjavur"; Status = "CURATED" }
    "Rameshwaram" = @{ Target = "Rameswaram"; Status = "CURATED" } # Renamed
    "Tirupati" = @{ Target = "Tirupati"; Status = "CURATED" }
    "Vizag" = @{ Target = "Visakhapatnam"; Status = "CURATED" } # Renamed
    "Araku Valley" = @{ Target = "Araku Valley"; Status = "CURATED" }
    "Horsley Hills" = @{ Target = "Horsley Hills"; Status = "SEARCH_ONLY" }
    "Warangal" = @{ Target = "Warangal"; Status = "SEARCH_ONLY" }
    "Vijayawada" = @{ Target = "Vijayawada"; Status = "SEARCH_ONLY" }
    "Kakinada" = @{ Target = "Kakinada"; Status = "SEARCH_ONLY" }
    "Rajahmundry" = @{ Target = "Rajahmundry"; Status = "SEARCH_ONLY" }
    "Guntur" = @{ Target = "Guntur"; Status = "SEARCH_ONLY" }
    "Nellore" = @{ Target = "Nellore"; Status = "SEARCH_ONLY" }
    "Anantapur" = @{ Target = "Anantapur"; Status = "SEARCH_ONLY" }
    "Kurnool" = @{ Target = "Kurnool"; Status = "SEARCH_ONLY" }
    "Srikakulam" = @{ Target = "Srikakulam"; Status = "SEARCH_ONLY" }
    "Eluru" = @{ Target = "Eluru"; Status = "SEARCH_ONLY" }
    "Nizamabad" = @{ Target = "Nizamabad"; Status = "SEARCH_ONLY" }
    "Khammam" = @{ Target = "Khammam"; Status = "SEARCH_ONLY" }
    "Karimnagar" = @{ Target = "Karimnagar"; Status = "SEARCH_ONLY" }
    "Ramagundam" = @{ Target = "Ramagundam"; Status = "SEARCH_ONLY" }
    "Mahbubnagar" = @{ Target = "Mahbubnagar"; Status = "SEARCH_ONLY" }
    "Nalgonda" = @{ Target = "Nalgonda"; Status = "SEARCH_ONLY" }
    "Adilabad" = @{ Target = "Adilabad"; Status = "SEARCH_ONLY" }
    "Suryapet" = @{ Target = "Suryapet"; Status = "SEARCH_ONLY" }
    "Jabalpur" = @{ Target = "Jabalpur"; Status = "SEARCH_ONLY" }
    "Kanha National Park" = @{ Target = "Kanha"; Status = "CURATED" }
    "Bandhavgarh National Park" = @{ Target = "Bandhavgarh"; Status = "CURATED" }
    "Pench National Park" = @{ Target = "Pench National Park"; Status = "SEARCH_ONLY" }
    "Mandu" = @{ Target = "Mandu"; Status = "SEARCH_ONLY" }
    "Raipur" = @{ Target = "Raipur"; Status = "SEARCH_ONLY" }
    "Jagdalpur" = @{ Target = "Jagdalpur"; Status = "SEARCH_ONLY" }
    "Bilaspur" = @{ Target = "Bilaspur"; Status = "SEARCH_ONLY" }
    "Korba" = @{ Target = "Korba"; Status = "SEARCH_ONLY" }
    "Durg" = @{ Target = "Durg"; Status = "SEARCH_ONLY" }
    "Cuttack" = @{ Target = "Cuttack"; Status = "SEARCH_ONLY" }
    "Gopalpur" = @{ Target = "Gopalpur"; Status = "SEARCH_ONLY" }
    "Daringbadi" = @{ Target = "Daringbadi"; Status = "SEARCH_ONLY" }
    "Sambalpur" = @{ Target = "Sambalpur"; Status = "SEARCH_ONLY" }
    "Rourkela" = @{ Target = "Rourkela"; Status = "SEARCH_ONLY" }
    "Baripada" = @{ Target = "Baripada"; Status = "SEARCH_ONLY" }
    "Digha" = @{ Target = "Digha"; Status = "SEARCH_ONLY" }
    "Mandarmani" = @{ Target = "Mandarmani"; Status = "SEARCH_ONLY" }
    "Sundarbans" = @{ Target = "Sundarbans"; Status = "CURATED" }
    "Shantiniketan" = @{ Target = "Shantiniketan"; Status = "SEARCH_ONLY" }
    "Bishnupur" = @{ Target = "Bishnupur"; Status = "SEARCH_ONLY" }
    "Siliguri" = @{ Target = "Siliguri"; Status = "SEARCH_ONLY" }
    "Murshidabad" = @{ Target = "Murshidabad"; Status = "SEARCH_ONLY" }
    "Bodh Gaya" = @{ Target = "Bodh Gaya"; Status = "CURATED" }
    "Patna" = @{ Target = "Patna"; Status = "SEARCH_ONLY" }
    "Nalanda" = @{ Target = "Nalanda"; Status = "SEARCH_ONLY" }
    "Rajgir" = @{ Target = "Rajgir"; Status = "SEARCH_ONLY" }
    "Vaishali" = @{ Target = "Vaishali"; Status = "SEARCH_ONLY" }
    "Bhagalpur" = @{ Target = "Bhagalpur"; Status = "SEARCH_ONLY" }
    "Gaya" = @{ Target = "Gaya"; Status = "SEARCH_ONLY" }
    "Ranchi" = @{ Target = "Ranchi"; Status = "SEARCH_ONLY" }
    "Netarhat" = @{ Target = "Netarhat"; Status = "SEARCH_ONLY" }
    "Deoghar" = @{ Target = "Deoghar"; Status = "SEARCH_ONLY" }
    "Jamshedpur" = @{ Target = "Jamshedpur"; Status = "SEARCH_ONLY" }
    "Dhanbad" = @{ Target = "Dhanbad"; Status = "SEARCH_ONLY" }
    "Hazaribagh" = @{ Target = "Hazaribagh"; Status = "SEARCH_ONLY" }
    "Shirdi" = @{ Target = "Shirdi"; Status = "SEARCH_ONLY" }
    "Nashik" = @{ Target = "Nashik"; Status = "CURATED" }
    "Aurangabad" = @{ Target = "Chhatrapati Sambhajinagar"; Status = "CURATED" } # Renamed
    "Alibaug" = @{ Target = "Alibaug"; Status = "CURATED" }
    "Panchgani" = @{ Target = "Panchgani"; Status = "SEARCH_ONLY" }
    "Matheran" = @{ Target = "Matheran"; Status = "CURATED" }
    "Lavasa" = @{ Target = "Lavasa"; Status = "SEARCH_ONLY" }
    "Ganpatipule" = @{ Target = "Ganpatipule"; Status = "SEARCH_ONLY" }
    "Tarkarli" = @{ Target = "Tarkarli"; Status = "CURATED" }
    "Kohlapur" = @{ Target = "Kolhapur"; Status = "SEARCH_ONLY" }
    "Solapur" = @{ Target = "Solapur"; Status = "SEARCH_ONLY" }
    "Satara" = @{ Target = "Satara"; Status = "SEARCH_ONLY" }
    "Ratnagiri" = @{ Target = "Ratnagiri"; Status = "SEARCH_ONLY" }
    "Karjad" = @{ Target = "Karjat"; Status = "SEARCH_ONLY" }
    "Dwarka" = @{ Target = "Dwarka"; Status = "CURATED" }
    "Somnath" = @{ Target = "Somnath"; Status = "CURATED" }
    "Gir National Park" = @{ Target = "Gir"; Status = "CURATED" }
    "Vadodara" = @{ Target = "Vadodara"; Status = "SEARCH_ONLY" }
    "Surat" = @{ Target = "Surat"; Status = "SEARCH_ONLY" }
    "Bhuj" = @{ Target = "Bhuj"; Status = "SEARCH_ONLY" }
    "Statue of Unity" = @{ Target = "Statue of Unity"; Status = "CURATED" }
    "Saputara" = @{ Target = "Saputara"; Status = "CURATED" }
    "Junagadh" = @{ Target = "Junagadh"; Status = "SEARCH_ONLY" }
    "Jamnagar" = @{ Target = "Jamnagar"; Status = "SEARCH_ONLY" }
    "Bhavnagar" = @{ Target = "Bhavnagar"; Status = "SEARCH_ONLY" }
    "Gandhinagar" = @{ Target = "Gandhinagar"; Status = "SEARCH_ONLY" }
    "Porbandar" = @{ Target = "Porbandar"; Status = "SEARCH_ONLY" }
    "Anand" = @{ Target = "Anand"; Status = "SEARCH_ONLY" }
    "Silvassa" = @{ Target = "Silvassa"; Status = "SEARCH_ONLY" }
}

# Count statuses
 = @()
 = @()
 = @()

foreach ( in ) {
     = [.Name]
    if (-not ) {
        Write-Host "Unmapped V8 City: "
        continue
    }
    if (.Status -eq "CURATED") {  +=  }
    elseif (.Status -eq "MERGED") {  +=  }
    elseif (.Status -eq "SEARCH_ONLY") {  +=  }
}

# Find unique Curated target destinations present in V8
 = ( | ForEach-Object {
     = [.Name]
    if (.Status -eq "CURATED" -or .Status -eq "MERGED") {
        .Target
    }
}) | Select-Object -Unique

# Find NEW destinations (in 137 target list, but not in V8)
 = @()
foreach ( in ) {
    if ( -notcontains ) {
         += 
    }
}

Write-Host "V8 Total: 0"
Write-Host "V8 -> CURATED entries: 0"
Write-Host "V8 -> MERGED entries: 0"
Write-Host "V8 -> SEARCH_ONLY entries: 0"
Write-Host "Unique Curated Destinations covered by V8: 0"
Write-Host "NEW Destinations to Add: 0"

 = .Count + .Count
Write-Host "Total Curated Target Catalog Reconciled:  (Target: 0)"

# Check reconciliation math:
# V8 Cities = CURATED (from V8) + MERGED (from V8) + SEARCH_ONLY (from V8)
# Target Catalog (137) = Unique CURATED/MERGED targets + NEW
Write-Host "
Math Check:"
Write-Host "200 = 0 (Curated) + 0 (Merged) + 0 (Search-Only)"
Write-Host "137 = 0 (Existing covered) + 0 (New added)"
