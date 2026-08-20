param()

function Get-ValidJavaHome {
  $candidates = @(
    $env:JAVA_HOME,
    'C:\Program Files\Java\jdk-21.0.12',
    'C:\Program Files\Java\jdk-21',
    'C:\Program Files\Java\latest'
  ) | Where-Object { $_ -and $_.Trim() -ne '' } | Select-Object -Unique

  foreach ($candidate in $candidates) {
    if (Test-Path (Join-Path $candidate 'bin\java.exe')) {
      return $candidate
    }
  }

  return $null
}

function Ensure-JavaHome {
  $resolved = Get-ValidJavaHome
  if (-not $resolved) {
    Write-Error 'No valid JDK found. Install JDK 21+ or set JAVA_HOME to a valid JDK path.'
    exit 1
  }

  $env:JAVA_HOME = $resolved
  Write-Host "Using JAVA_HOME=$resolved"
}
