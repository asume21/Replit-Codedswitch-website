$source = "..\GitBridge\"
$dest = ".\"

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "$dest\client"
New-Item -ItemType Directory -Force -Path "$dest\server"
New-Item -ItemType Directory -Force -Path "$dest\public"

# Copy client files
Copy-Item -Path "$source\client\*" -Destination "$dest\client\" -Recurse -Force

# Copy server files (excluding sensitive ones)
Get-ChildItem -Path "$source\server" -Exclude @("node_modules", "*.bat", "*.patch") | 
    Copy-Item -Destination "$dest\server\" -Recurse -Force

# Copy root files
Copy-Item -Path "$source\package.json" -Destination $dest -Force
Copy-Item -Path "$source\package-lock.json" -Destination $dest -Force
Copy-Item -Path "$source\tsconfig.json" -Destination $dest -Force
Copy-Item -Path "$source\vite.config.ts" -Destination $dest -Force

Write-Host "Files copied successfully!" -ForegroundColor Green
