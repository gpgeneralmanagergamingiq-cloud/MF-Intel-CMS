# ============================================
# PowerShell FTP Upload Script
# ============================================

param(
    [string]$FtpHost,
    [string]$FtpUser,
    [string]$FtpPass,
    [string]$RemoteDir
)

$ErrorActionPreference = "Stop"

Write-Host "Connecting to FTP server..." -ForegroundColor Cyan

# Function to upload a file
function Upload-File {
    param($LocalPath, $RemotePath)
    
    try {
        $ftpUri = "ftp://$FtpHost$RemotePath"
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        # Read file
        $fileContent = [System.IO.File]::ReadAllBytes($LocalPath)
        $ftpRequest.ContentLength = $fileContent.Length
        
        # Upload
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
        
        return $true
    }
    catch {
        Write-Host "Error uploading $LocalPath : $_" -ForegroundColor Red
        return $false
    }
}

# Function to create directory
function Create-FtpDirectory {
    param($RemotePath)
    
    try {
        $ftpUri = "ftp://$FtpHost$RemotePath"
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
        $ftpRequest.UsePassive = $true
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
        return $true
    }
    catch {
        # Directory might already exist, which is fine
        return $true
    }
}

# Main upload logic
try {
    Write-Host "Starting upload process..." -ForegroundColor Green
    
    $distPath = Join-Path $PSScriptRoot "dist"
    
    if (-not (Test-Path $distPath)) {
        Write-Host "Error: dist folder not found!" -ForegroundColor Red
        exit 1
    }
    
    # Get all files recursively
    $files = Get-ChildItem -Path $distPath -Recurse -File
    $totalFiles = $files.Count
    $currentFile = 0
    
    Write-Host "Found $totalFiles files to upload" -ForegroundColor Cyan
    
    foreach ($file in $files) {
        $currentFile++
        $relativePath = $file.FullName.Substring($distPath.Length).Replace("\", "/")
        $remotePath = "$RemoteDir$relativePath"
        
        # Create directory structure if needed
        $remoteDirectory = [System.IO.Path]::GetDirectoryName($remotePath).Replace("\", "/")
        if ($remoteDirectory -ne $RemoteDir) {
            Create-FtpDirectory -RemotePath $remoteDirectory | Out-Null
        }
        
        # Upload file
        $percentage = [math]::Round(($currentFile / $totalFiles) * 100)
        Write-Host "[$percentage%] Uploading: $relativePath" -ForegroundColor Yellow
        
        $success = Upload-File -LocalPath $file.FullName -RemotePath $remotePath
        
        if (-not $success) {
            Write-Host "Failed to upload: $relativePath" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
    Write-Host "Upload completed successfully!" -ForegroundColor Green
    Write-Host "Total files uploaded: $totalFiles" -ForegroundColor Cyan
    exit 0
}
catch {
    Write-Host "Deployment failed: $_" -ForegroundColor Red
    exit 1
}
