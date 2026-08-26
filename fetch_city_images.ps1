# PowerShell script to fetch curated Wikimedia image URLs for catalog cities using Wikipedia/MediaWiki API.
# Generates city_images.csv in the project root.

$ErrorActionPreference = "Continue"

$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = Get-Location }

$citiesFile = Join-Path $scriptDir "cities.txt"
$csvFile = Join-Path $scriptDir "city_images.csv"

if (-not (Test-Path $citiesFile)) {
    Write-Error "cities.txt not found at $citiesFile"
    exit 1
}

# User agent mandatory for MediaWiki API and Wikimedia request compliance
$headers = @{
    "User-Agent" = "GlobeTrotterCityImageFetcher/1.0 (educational/hackathon project)"
}

# Initialize CSV file with header
"City,DirectWikimediaImageURL" | Out-File -FilePath $csvFile -Encoding utf8 -Force
Write-Host "Initialized $csvFile"

$cities = Get-Content -Path $citiesFile | Where-Object { $_.Trim().Length -gt 0 }
Write-Host "Found $($cities.Count) cities to process."

function Verify-ImageUrl {
    param ([string]$url)
    if ([string]::IsNullOrWhiteSpace($url)) { return $false }
    $res = $null
    try {
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.Method = "HEAD"
        $req.UserAgent = "GlobeTrotterCityImageFetcher/1.0 (educational/hackathon project)"
        $req.Timeout = 5000
        $res = $req.GetResponse()
        $statusCode = [int]$res.StatusCode
        $contentType = $res.ContentType
        if ($statusCode -eq 200 -and $contentType -like "image/*") {
            return $true
        }
    } catch {
        return $false
    } finally {
        if ($null -ne $res) {
            $res.Close()
            $res.Dispose()
        }
    }
    return $false
}

function Get-WikimediaImageForTitle {
    param ([string]$searchTitle)

    $encodedTitle = [uri]::EscapeDataString($searchTitle)
    $apiUrl = "https://en.wikipedia.org/w/api.php?action=query&titles=$encodedTitle&prop=pageimages&pithumbsize=1280&piprop=original|thumbnail|name&format=json&redirects=1"

    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -TimeoutSec 10
        if (-not $response -or -not $response.query -or -not $response.query.pages) { return $null }

        foreach ($prop in $response.query.pages.PSObject.Properties) {
            $page = $prop.Value
            if ($page.missing -ne $null) { continue }

            # Try original image first
            if ($page.original -and $page.original.source) {
                $imgUrl = $page.original.source
                $w = $page.original.width
                $h = $page.original.height

                # Ensure image meets width requirement and is landscape-oriented
                if (($null -eq $w -or $w -ge 500) -and ($null -eq $h -or $null -eq $w -or $w -ge $h)) {
                    if (Verify-ImageUrl $imgUrl) {
                        return $imgUrl
                    }
                }
            }

            # Try thumbnail if original was invalid or missing
            if ($page.thumbnail -and $page.thumbnail.source) {
                $thumbUrl = $page.thumbnail.source
                $tw = $page.thumbnail.width
                $th = $page.thumbnail.height

                if (($null -eq $tw -or $tw -ge 500) -and ($null -eq $th -or $null -eq $tw -or $tw -ge $th)) {
                    if (Verify-ImageUrl $thumbUrl) {
                        return $thumbUrl
                    }
                }
            }
        }
    } catch {
        # Log error silently and allow fallback
    }

    return $null
}

$processed = 0
foreach ($city in $cities) {
    $cityName = $city.Trim()
    $processed++
    Write-Host "[$processed/$($cities.Count)] Processing: $cityName..." -NoNewline

    $imageUrl = $null

    # Strategy 1: Exact city name
    $imageUrl = Get-WikimediaImageForTitle -searchTitle $cityName
    Start-Sleep -Milliseconds 400

    # Strategy 2: City name + ", India"
    if (-not $imageUrl) {
        $imageUrl = Get-WikimediaImageForTitle -searchTitle "$cityName, India"
        Start-Sleep -Milliseconds 400
    }

    # Strategy 3: City name + " city"
    if (-not $imageUrl) {
        $imageUrl = Get-WikimediaImageForTitle -searchTitle "$cityName city"
        Start-Sleep -Milliseconds 400
    }

    if (-not $imageUrl) {
        $imageUrl = "EMPTY"
        Write-Host " -> EMPTY" -ForegroundColor Yellow
    } else {
        Write-Host " -> SUCCESS" -ForegroundColor Green
    }

    # Progressively append result to CSV
    "$cityName,$imageUrl" | Out-File -FilePath $csvFile -Encoding utf8 -Append

    # Rate limiting delay
    Start-Sleep -Milliseconds 500
}

Write-Host "Completed processing $($cities.Count) cities."
Write-Host "Output saved to $csvFile"
