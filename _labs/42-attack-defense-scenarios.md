---
title: "Attack & Defense Scenarios"
module: network-security
excerpt: "Run eight scenarios — WAF blocks, FQDN filtering, default-deny, forced tunnel, IDPS, custom + geo WAF rules."
level: 400
duration: "45 min"
doc_type: "Build lab"
persona: "Security engineer"
learning_path: "Network Security"
nav_order: 19
featured: true
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 400 | Security engineer | 45 min | Prove each security control fires by running real attack/defense scenarios. |

## Why this matters

A control you can't demonstrate is a control you can't trust. Each scenario triggers one
layer and shows the exact result — HTTP `403`, HTTP `470`, a blocked connection, or an
IDPS alert.

<div class="notice--info" markdown="1">
Replace the example Front Door hostname with the one your `04-app-delivery.ps1` printed
(looks like `https://ns-fd-demo-xxxxxxxx.b01.azurefd.net`). Connect to VMs via
**Azure Bastion** → VM `NS-W11-demo` → username `azureadmin`.
</div>

## S1 — WAF blocks a web attack (403)

Front Door WAF allows normal traffic and blocks OWASP attacks at the Microsoft edge.

```powershell
$FD = "https://ns-fd-demo-xxxxxxxx.b01.azurefd.net"   # your endpoint
curl.exe -s -o NUL -w "normal -> HTTP %{http_code}`n" "$FD/"
curl.exe -s -o NUL -w "SQLi   -> HTTP %{http_code}`n" "$FD/?id=1%20OR%201=1--"
curl.exe -s -o NUL -w "XSS    -> HTTP %{http_code}`n" "$FD/?q=<script>alert(1)</script>"
```

**Expected:** `200`, `403`, `403`. *Teaches:* layered L7 protection, WAF Prevention mode.

## S2 — Firewall FQDN filtering (allowed vs blocked)

The `Allow-Web` rule permits only a curated list (`*.microsoft.com`, `*.google.com`,
`www.bing.com`, `*.ubuntu.com`, `*.kali.org`). Everything else hits default-deny → **HTTP 470**.

```powershell
# From the Win11 VM (Bastion)
curl.exe -s -o NUL -w "microsoft.com -> HTTP %{http_code}`n" http://www.microsoft.com
curl.exe -s -o NUL -w "facebook.com  -> HTTP %{http_code}`n" http://www.facebook.com   # firewall denies
```

**Expected:** microsoft.com → `200/301`; facebook.com → `470 Deny` or timeout. *Teaches:* outbound FQDN filtering.

## S3 — Default-deny segmentation

Any flow matching no allow rule is dropped with `HTTP 470 … Deny. Reason: No rule matched.`
— that message comes from the firewall itself.

```bash
# From the Kali VM (Bastion)
bash -c 'exec 3<>/dev/tcp/example.com/80; printf "GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n" >&3; cat <&3; exec 3>&-'
```

*Teaches:* NSG default-deny + firewall east-west/egress control.

## S4 — Forced-tunnel egress

The UDR sends `0.0.0.0/0` to the firewall's private IP. Confirm the route:

```powershell
az network route-table route list -g rg-netsec-demo --route-table-name NS-RT-demo `
  --query "[].{Name:name, Prefix:addressPrefix, NextHop:nextHopType, IP:nextHopIpAddress}" -o table
```

**Expected:** a `default-to-firewall` route → `0.0.0.0/0` → `VirtualAppliance` → `10.0.25.4`.

## S5 — Firewall IDPS: outbound detection

Allow the test host, then trigger a signature; IDPS (Alert mode) logs it.

```powershell
# Step 1 — allow testmynids.org (local pwsh)
az network firewall policy rule-collection-group collection add-filter-collection `
  -g rg-netsec-demo --policy-name NS-FWPolicy-demo --rule-collection-group-name LabRuleCollectionGroup `
  --name Allow-IDPS-Test --collection-priority 310 --action Allow --rule-name allow-testmynids `
  --rule-type ApplicationRule --target-fqdns "testmynids.org" `
  --source-addresses "10.0.27.0/24" "10.0.28.0/24" --protocols Http=80 Https=443
```

```bash
# Step 2 — trigger from the Kali VM (Bastion), several times
for i in 1 2 3 4 5; do bash -c 'exec 3<>/dev/tcp/testmynids.org/80; printf "GET /uid/index.html HTTP/1.1\r\nHost: testmynids.org\r\nConnection: close\r\n\r\n" >&3; cat <&3; exec 3>&-'; echo "--- hit $i ---"; done
```

**Expected:** `200 OK` with body `uid=0(root) gid=0(root) groups=0(root)`, and an
`AZFWIdpsSignature` alert (see the Telemetry lab).

## S6 — Firewall IDPS: inbound via DNAT

Publish a port on the firewall's public IP and attack it from the internet.

```powershell
$fwPip = az network public-ip show -g rg-netsec-demo -n NS-FW-PIP-demo --query ipAddress -o tsv
# Add a DNAT rule (TCP 8080 → 10.0.27.4:80), then attack it:
curl.exe -s -o NUL -w "HTTP %{http_code}`n" "http://$fwPip`:8080/?cmd=cat%20/etc/passwd"
```

<div class="notice--warning" markdown="1">
This exposes a port to the internet. **Remove the DNAT rule** after the demo
(`... collection remove --name DNAT-Inbound-Test`).
</div>

## S7 — App Gateway WAF: custom rule

Block any request whose `User-Agent` contains `evilbot`.

```powershell
az network application-gateway waf-policy custom-rule create -g rg-netsec-demo `
  --policy-name NS-AGPolicy-demo --name BlockEvilBot --priority 10 --rule-type MatchRule --action Block
az network application-gateway waf-policy custom-rule match-condition add -g rg-netsec-demo `
  --policy-name NS-AGPolicy-demo --name BlockEvilBot --match-variables RequestHeaders.User-Agent `
  --operator Contains --values "evilbot" --transforms Lowercase

curl.exe -s -o NUL -w "normal  -> HTTP %{http_code}`n" -A "Mozilla/5.0" "$FD/"
curl.exe -s -o NUL -w "evilbot -> HTTP %{http_code}`n" -A "evilbot/1.0" "$FD/"
```

**Expected:** `200` then `403`. *Clean up:* `custom-rule delete ... --name BlockEvilBot`.

## S8 — App Gateway WAF: geo-block

Block by the visitor's country with a `GeoMatch` custom rule.

```powershell
az network application-gateway waf-policy custom-rule create -g rg-netsec-demo `
  --policy-name NS-AGPolicy-demo --name BlockCountry --priority 5 --rule-type MatchRule --action Block
az network application-gateway waf-policy custom-rule match-condition add -g rg-netsec-demo `
  --policy-name NS-AGPolicy-demo --name BlockCountry --match-variables RemoteAddr --operator GeoMatch --values "AU"
```

Block a country you're **not** in → still `200`; flip it to **your** country → `403`.
`RemoteAddr` uses the real client IP (from `X-Forwarded-For`), which is what you want.

<div class="notice--warning" markdown="1">
**Always remove geo-blocks** so you don't lock yourself out:
`custom-rule delete ... --name BlockCountry`.
</div>

## Summary of learnings

- Two WAF layers block **SQLi/XSS/custom/geo** attacks with `403`.
- The firewall enforces **FQDN allow-lists, default-deny, and forced tunneling** (`470`).
- **IDPS** detects both **outbound and inbound** attack signatures.
- Every action leaves **evidence** — read it in the next lab.
