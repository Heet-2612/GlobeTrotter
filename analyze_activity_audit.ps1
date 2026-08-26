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

# Load 137 target catalog list
$targetCurated = @(
    "Delhi","Agra","Jaipur","Udaipur","Jodhpur","Jaisalmer","Varanasi","Goa","Mumbai","Kerala","Kochi","Alappuzha","Munnar","Rishikesh","Haridwar","Mussoorie","Nainital","Shimla","Manali","Dharamshala","Srinagar","Gulmarg","Pahalgam","Ladakh","Amritsar","Kolkata","Chennai","Bengaluru","Hyderabad","Puducherry","Ooty","Mysuru","Hampi","Madurai","Tirupati","Rameswaram","Darjeeling","Gangtok","Shillong","Kaziranga","Andaman Islands","Ujjain","Bodh Gaya","Puri","Rann of Kutch","Statue of Unity",
    "Bhopal","Ranthambore","Pushkar","Ajmer","Chittorgarh","Bikaner","Mount Abu","Mathura-Vrindavan","Ayodhya","Sarnath","Lucknow","Prayagraj","Khajuraho","Orchha","Gwalior","Bhedaghat","Kanha","Bandhavgarh","Pachmarhi","Ahmedabad","Dwarka","Somnath","Gir","Diu","Champaner-Pavagadh","Pune","Chhatrapati Sambhajinagar","Ajanta Caves","Ellora Caves","Lonavala-Khandala","Mahabaleshwar","Alibaug","Gokarna","Coorg","Chikkamagaluru","Badami-Pattadakal","Dandeli","Nagarhole","Bandipur","Varkala","Wayanad","Thekkady-Periyar","Kumarakom","Kodaikanal","Mahabalipuram","Thanjavur","Kanchipuram","Kanyakumari","Visakhapatnam","Araku Valley","Sanchi","Omkareshwar","Kedarnath","Badrinath","Vaishno Devi","Lakshadweep","Nashik","Jim Corbett","Valley of Flowers","Spiti Valley","Auli",
    "Bundi","Shekhawati","Ranakpur","Dholavira","Modhera-Patan","Saputara","Matheran","Tarkarli","Bhimashankar","Lonar","Sakleshpur","Murudeshwar","Bekal","Vagamon","Kozhikode","Kannur","Yercaud","Valparai","Chettinad","Pichavaram","Konark","Chilika Lake","Sundarbans","Kalimpong","Majuli","Manas","Tawang","Ziro Valley","Cherrapunji (Sohra)","Dawki"
)

# Build comprehensive evaluation data for all 137 destinations
$auditData = @()

foreach ($t in $targetCurated) {
    $sourceCities = @()
    $existingActs = @()
    $status = "NEW"
    
    # Check V8 matches
    switch ($t) {
        "Delhi" { $sourceCities = @("Delhi (V3)") }
        "Goa" { $sourceCities = @("Goa (V3)") }
        "Alappuzha" { $sourceCities = @("Alleppey (ID 21)") }
        "Mysuru" { $sourceCities = @("Mysore (ID 24)") }
        "Puducherry" { $sourceCities = @("Pondicherry (ID 27)") }
        "Bengaluru" { $sourceCities = @("Bangalore (ID 38)") }
        "Cherrapunji (Sohra)" { $sourceCities = @("Cherrapunji (ID 44)") }
        "Ladakh" { $sourceCities = @("Leh (ID 12)") }
        "Mathura-Vrindavan" { $sourceCities = @("Mathura (ID 18)", "Vrindavan (ID 19)") }
        "Andaman Islands" { $sourceCities = @("Port Blair (ID 92)", "Havelock Island (ID 93)", "Neil Island (ID 94)") }
        "Lakshadweep" { $sourceCities = @("Kavaratti (ID 95)", "Bangaram Island (ID 96)") }
        "Nagarhole" { $sourceCities = @("Kabini (ID 100)") }
        "Badami-Pattadakal" { $sourceCities = @("Badami (ID 101)", "Pattadakal (ID 102)", "Aihole (ID 103)") }
        "Lonavala-Khandala" { $sourceCities = @("Lonavala (ID 51)") }
        "Chikkamagaluru" { $sourceCities = @("Chikmagalur (ID 98)") }
        "Rameswaram" { $sourceCities = @("Rameshwaram (ID 113)") }
        "Visakhapatnam" { $sourceCities = @("Vizag (ID 115)") }
        "Kanha" { $sourceCities = @("Kanha National Park (ID 137)") }
        "Bandhavgarh" { $sourceCities = @("Bandhavgarh National Park (ID 138)") }
        "Chhatrapati Sambhajinagar" { $sourceCities = @("Aurangabad (ID 174)") }
        "Gir" { $sourceCities = @("Gir National Park (ID 188)") }
        default {
            $matchedCity = $cities | Where-Object { $_.Name -eq $t }
            if ($matchedCity) {
                $sourceCities = @("$($matchedCity.Name) (ID $($matchedCity.Id))")
            }
        }
    }

    # Fetch activities for source cities
    foreach ($sc in $sourceCities) {
        if ($sc -match "ID (\d+)") {
            $id = [int]$Matches[1]
            if ($cityActivities.ContainsKey($id)) {
                $existingActs += $cityActivities[$id]
            }
        }
    }

    $actCount = $existingActs.Count
    $quality = "N/A (NEW Destination)"
    $needsNew = $false
    $structFlag = "None"

    if ($actCount -gt 0) {
        $hasTemplate = $false
        foreach ($a in $existingActs) {
            if ($a -match "Historic Heritage|Scenic Valley|Traditional Craft|Regional Street Food") {
                $hasTemplate = $true
                break
            }
        }
        if ($hasTemplate) {
            $quality = "Generic Autogenerated Templates"
            $needsNew = $true
        } else {
            $quality = "High-Quality Authentic POIs"
            if ($actCount -lt 4) { $needsNew = $true }
        }
    } else {
        $needsNew = $true
    }

    # Identify structural flags
    if ($t -eq "Kerala") { $structFlag = "STATE REGION OVERLAP (Overlaps with Kochi, Alappuzha, Munnar, Wayanad)" }
    elseif ($t -eq "Shekhawati") { $structFlag = "REGIONAL BELT (Covers Mandawa, Nawalgarh, Jhunjhunu)" }
    elseif ($t -eq "Sarnath") { $structFlag = "SUB-DESTINATION (Located 10km from Varanasi)" }
    elseif ($t -eq "Dholavira" -or $t -eq "Modhera-Patan" -or $t -eq "Lonar" -or $t -eq "Bhimashankar") { $structFlag = "SINGLE-POI DESTINATION (May be better under broader regional hub)" }
    elseif ($t -eq "Jim Corbett" -or $t -eq "Kanha" -or $t -eq "Bandhavgarh" -or $t -eq "Gir" -or $t -eq "Sundarbans" -or $t -eq "Kaziranga" -or $t -eq "Manas") { $structFlag = "NATIONAL PARK / WILDLIFE PRESERVE (Requires specialized safari & eco POIs)" }

    $auditData += [PSCustomObject]@{
        Destination = $t
        SourceCities = ($sourceCities -join ", ")
        ActivityCount = $actCount
        Activities = ($existingActs -join " | ")
        Quality = $quality
        NeedsNew = $needsNew
        StructuralFlag = $structFlag
    }
}

Write-Host "Total Curated Analyzed: $($auditData.Count)"
Write-Host "Destinations with >= 4 Authentic Activities: $(($auditData | Where-Object { $_.ActivityCount -ge 4 -and $_.Quality -like "High-Quality*" }).Count)"
Write-Host "Destinations with Generic Templates or < 4 Activities: $(($auditData | Where-Object { $_.NeedsNew -eq $true }).Count)"
