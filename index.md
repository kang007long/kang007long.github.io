---
layout: default
title: "Jarvis的博客"
---
<h1 class="page-header">
  Jarvis的博客
</h1>
{% for post in site.posts %}
<h2>
  <a href="{{ post.url }}">
    {{ post.title }}
  </a> 
  <div class="post-date">
	<span class="glyphicon glyphicon-time"></span>
	{{ post.date | date_to_string }}
  </div>
</h2>
<hr>
{{ post.content }}
<hr>
{% endfor %}
<!-- Pager -->
<ul class="pager">
  {% if paginator.previous_page %} {% if paginator.previous_page == 1 %}
  <li class="previous">
    <a href="{{ site.url }}/">
      &larr; 更早
    </a>
  </li>
  {% else %}
  <li class="previous">
    <a href="{{ site.url }}/page{{ paginator.previous_page }}">
      &larr; 更早
    </a>
  </li>
  {% endif %} {% endif %} {% if paginator.next_page %}
  <li class="next">
    <a href="{{ site.url }}/page{{ paginator.next_page }}">
      更新 &rarr;
    </a>
  </li>
  {% endif %}
</ul>