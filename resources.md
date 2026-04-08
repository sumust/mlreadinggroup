---
layout: default
title: Resources
permalink: /resources/
---

<div class="page-hero">
  <h1>Resources</h1>
  <p>Papers, courses, textbooks, and other resources for the ML/RL Reading Group.</p>
</div>

<!-- Tab bar -->
<div class="resource-tabs">
  <button class="resource-tab active" data-tab="papers">Recommended Papers</button>
  <button class="resource-tab" data-tab="learning">Learning Resources</button>
</div>

<!-- Recommended Papers tab -->
<div class="resource-panel active" id="tab-papers">
  <div class="papers-content">
    <h2>Machine Learning (ML)</h2>
    <ul>
      {% for paper in site.data.resources.papers.ml %}
      <li>
        <a href="{{ paper.url }}">{{ paper.title }}</a>
        <span class="paper-meta">{% if paper.venue %}{{ paper.venue }} {% endif %}{{ paper.year }}</span>
      </li>
      {% endfor %}
    </ul>

    <h2>Reinforcement Learning (RL)</h2>
    <ul>
      {% for paper in site.data.resources.papers.rl %}
      <li>
        <a href="{{ paper.url }}">{{ paper.title }}</a>
        <span class="paper-meta">{% if paper.venue %}{{ paper.venue }} {% endif %}{{ paper.year }}</span>
      </li>
      {% endfor %}
    </ul>
  </div>
</div>

<!-- Learning Resources tab -->
<div class="resource-panel" id="tab-learning">
  <div class="papers-content">
    <h2>Reinforcement Learning</h2>
    <ul>
      {% for item in site.data.resources.learning.rl %}
      <li>
        <a href="{{ item.url }}">{{ item.title }}</a>
        {% if item.kind %}<span class="resource-kind">{{ item.kind }}</span>{% endif %}
      </li>
      {% endfor %}
    </ul>

    <h2>Neural Networks</h2>
    <ul>
      {% for item in site.data.resources.learning.neural_networks %}
      <li>
        <a href="{{ item.url }}">{{ item.title }}</a>
        {% if item.kind %}<span class="resource-kind">{{ item.kind }}</span>{% endif %}
      </li>
      {% endfor %}
    </ul>
  </div>
</div>
