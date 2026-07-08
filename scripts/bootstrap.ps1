<#
.SYNOPSIS
    L400 Azure Arc workshop bootstrap. Installs SQL Server 2022 Evaluation and onboards
    the (simulated) machine to Azure Arc.
.DESCRIPTION
    Runs INSIDE a Windows Server VM. Blocks the Azure IMDS endpoint so the Connected
    Machine agent treats the VM as an on-premises/hybrid machine (LAB ONLY), installs
    SQL Server 2022 Evaluation (Enterprise features), installs the Connected Machine
    agent, and connects to Azure Arc using a service principal.
.NOTES
    Blocking IMDS is a lab-only technique. Never run this on a production Azure VM.
#>
param(
    [Parameter(Mandatory)][string]$SubscriptionId,
    [Parameter(Mandatory)][string]$ResourceGroup,
    [Parameter(Mandatory)][string]$TenantId,
    [Parameter(Mandatory)][string]$Location,
    [Parameter(Mandatory)][string]$SpAppId,
    [Parameter(Mandatory)][string]$SpSecret
)

$ErrorActionPreference = "Stop"
$work = "C:\ArcLab"; New-Item -ItemType Directory -Force -Path $work | Out-Null

# 1) Simulate on-prem: block the Azure Instance Metadata Service (LAB ONLY)
New-NetFirewallRule -Name "Block-Azure-IMDS" -DisplayName "Block Azure IMDS (Arc lab)" `
    -Direction Outbound -Action Block -RemoteAddress 169.254.169.254 -Profile Any -Enabled True

# 2) Install SQL Server 2022 Evaluation (Enterprise features, 180-day trial)
$ssei = Join-Path $work "SQL2022-SSEI-Eval.exe"
Invoke-WebRequest -Uri "https://go.microsoft.com/fwlink/p/?linkid=2215158" -OutFile $ssei
& $ssei /ACTION=Download /MEDIATYPE=CAB /MEDIAPATH=$work /QUIET | Out-Null

$box = Get-ChildItem $work -Filter "SQLServer2022-*.exe" | Select-Object -First 1
& $box.FullName /X:"$work\media" /Q | Out-Null

& "$work\media\setup.exe" /Q /ACTION=Install /FEATURES=SQLENGINE `
    /INSTANCENAME=MSSQLSERVER /SQLSVCACCOUNT="NT AUTHORITY\NETWORK SERVICE" `
    /SQLSYSADMINACCOUNTS="BUILTIN\Administrators" /TCPENABLED=1 `
    /IACCEPTSQLSERVERLICENSETERMS /UPDATEENABLED=0
# No product key => Evaluation (Enterprise) edition.

# 3) Install the Azure Connected Machine agent
$msi = Join-Path $work "AzureConnectedMachineAgent.msi"
Invoke-WebRequest -Uri "https://aka.ms/AzureConnectedMachineAgent" -OutFile $msi
Start-Process msiexec.exe -ArgumentList "/i `"$msi`" /qn" -Wait

$azcm = "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe"

# 4) Connect to Azure Arc via the onboarding service principal
& $azcm connect `
    --service-principal-id  $SpAppId `
    --service-principal-secret $SpSecret `
    --tenant-id       $TenantId `
    --subscription-id $SubscriptionId `
    --resource-group  $ResourceGroup `
    --location        $Location `
    --tags "Project=ArcWorkshop,Level=L400,Simulated=true"

Write-Host "Machine onboarded. Agent status:"
& $azcm show
