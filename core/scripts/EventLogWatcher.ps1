[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$LogName = "System"
$ServiceName = "Service Control Manager" 
$XPathQuery = "*[System[Provider[@Name='$ServiceName']]]"

$Watcher = New-Object System.Diagnostics.Eventing.Reader.EventLogWatcher (
    New-Object System.Diagnostics.Eventing.Reader.EventLogQuery($LogName, [System.Diagnostics.Eventing.Reader.PathType]::LogName, $XPathQuery)
);

$Action = {
    $E = $EventArgs.EventRecord;
    [PSCustomObject]@{
        time    = $E.TimeCreated.ToString("yyyy-MM-dd HH:mm:ss");
        id      = $E.Id;
        level   = $E.LevelDisplayName;
        source  = $E.ProviderName;
        message = $E.FormatDescription();
    } | ConvertTo-Json -Compress | Write-Host
};
Register-ObjectEvent -InputObject $Watcher -EventName "EventRecordWritten" -Action $Action;
$Watcher.Enabled = $true;

try {
    while ($true) { 
        Start-Sleep -Milliseconds 500
    }
}
finally {
    $Watcher.Enabled = $false;
    $Watcher.Dispose();
}