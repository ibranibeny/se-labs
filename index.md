---
layout: splash
permalink: /
title: "SE Labs"
header:
  overlay_color: "#0b3d91"
  overlay_filter: "0.25"
  actions:
    - label: "Browse modules"
      url: /modules/
excerpt: >-
  Hands-on, self-paced labs for Azure & cloud solution engineering.
  Learn by doing — one module at a time.
---

## Learning modules

Each module is a curated learning path made of hands-on labs. Pick a module to begin.

<div class="lab-cards">
{% assign modules = site.modules | sort: 'order' %}
{% for mod in modules %}
  {% assign mlabs = site.labs | where: "module", mod.slug %}
  <a class="lab-card" href="{{ mod.url | relative_url }}">
    <span class="lab-card__level">{{ mod.level_range }}</span>
    <div class="lab-card__title"><i class="{{ mod.icon }}"></i>&nbsp; {{ mod.title }}</div>
    <div class="lab-card__desc">{{ mod.excerpt }}</div>
    <div class="lab-card__meta">{{ mlabs | size }} labs · {{ mod.duration_total }}</div>
  </a>
{% endfor %}
</div>

## Featured labs

<div class="lab-cards">
{% assign featured = site.labs | where: "featured", true | sort: 'nav_order' %}
{% for lab in featured %}
  <a class="lab-card" href="{{ lab.url | relative_url }}">
    <span class="lab-card__level">L{{ lab.level }}</span>
    <div class="lab-card__title">{{ lab.title }}</div>
    <div class="lab-card__desc">{{ lab.excerpt }}</div>
  </a>
{% endfor %}
</div>

## Why SE Labs?

- **Learn by doing** — every lab ends with something running in your own subscription.
- **Progressive levels** — L100 concepts through L400 build labs.
- **Grounded** — technical content is grounded in official Microsoft documentation.
