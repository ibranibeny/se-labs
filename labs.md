---
title: "All Labs"
permalink: /labs/
layout: single
author_profile: false
toc: false
classes: wide
---

Every lab across all modules, in recommended order.

<div class="lab-cards">
{% assign labs = site.labs | sort: 'nav_order' %}
{% for lab in labs %}
  <a class="lab-card" href="{{ lab.url | relative_url }}">
    <span class="lab-card__level">L{{ lab.level }}</span>
    <div class="lab-card__title">{{ lab.title }}</div>
    <div class="lab-card__desc">{{ lab.excerpt }}</div>
  </a>
{% endfor %}
</div>
