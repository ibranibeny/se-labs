---
title: "Modules"
permalink: /modules/
layout: single
author_profile: false
toc: false
classes: wide
---

Curated learning paths. Each module bundles hands-on labs from L100 to L400.

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
