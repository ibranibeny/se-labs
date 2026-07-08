---
title: "Secure the endpoint (API key + Caddy)"
module: self-hosted-inference
excerpt: "Protect the /v1 endpoint with a self-generated 256-bit API key behind a Caddy HTTPS gateway."
level: 300
duration: "20 min"
doc_type: "How-to"
persona: "AI engineer / cloud engineer"
learning_path: "Self-Hosted Inference"
nav_order: 7
report_issue: "https://github.com/ibranibeny/se-labs/issues/new"
---

## Lab details

| Level | Persona | Duration | Purpose |
|-------|---------|----------|---------|
| 300 | AI / cloud engineer | 20 min | Generate an API key and confirm the Caddy gateway enforces it, so only authorized callers reach the model. |

## Why this matters

Your endpoint is public HTTPS. Without a secret, anyone who finds the URL could use your
GPU. The Caddy gateway checks an **API key** on every `/v1` request — you own the key.

## Generate the API key

The helper script writes a fresh **256-bit** key to `deploy/.secrets/api_key`
(git-ignored) and never prints it:

```bash
# create the key once, or rotate an existing one
./00-genkey.sh
./00-genkey.sh --rotate
```

Under the hood that's `openssl rand -hex 32` (64 hex characters).

Load it into your shell when you need the value:

```bash
export API_KEY=$(cat deploy/.secrets/api_key)
```

<div class="notice--danger" markdown="1">
**Keep it secret.** Never commit or publish the key. If it ever leaks, rotate it
immediately with `./00-genkey.sh --rotate`. After a rotation, re-run `./05-run-sglang.sh` —
only Caddy restarts; the model stays loaded.
</div>

## How the gateway enforces it

Caddy (configured from `Caddyfile.tmpl`) terminates TLS and requires the API key before
proxying to SGLang on `127.0.0.1:30000`. Direct clients pass it as a **Bearer** token
(`Authorization: Bearer <API_KEY>`); Microsoft Foundry BYOM sends it in the **`api-key`**
header. The `/health` path stays open (no auth) so you can probe liveness.

## Verify

An unauthenticated call to `/v1` should be rejected, and an authenticated one should
succeed:

```bash
# No key -> 401 Unauthorized
curl -s -o /dev/null -w "%{http_code}\n" https://<your-domain>/v1/models

# With key (Bearer) -> 200 OK
curl -s https://<your-domain>/v1/models \
  -H "Authorization: Bearer $API_KEY"
```

A quick chat completion (OpenAI-compatible):

```bash
curl -s https://<your-domain>/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "Qwen/Qwen3.6-35B-A3B-FP8",
        "messages": [{"role":"user","content":"Say hello in one sentence."}]
      }'
```

<div class="notice--info" markdown="1">
For **direct** calls, use the model's full HuggingFace id (`Qwen/Qwen3.6-35B-A3B-FP8`).
When you register the model in **Foundry** next, the model id must have **no slash**
(`Qwen3.6-35B-A3B-FP8`) because ModelGateway only allows letters/digits/`-`/`_`/`.`.
</div>

## Summary of learnings

- The endpoint is protected by a **self-generated 256-bit API key** you control.
- Caddy enforces the key on `/v1`; `/health` stays open for probes.
- **Rotating** the key restarts only Caddy — the loaded model is untouched.
