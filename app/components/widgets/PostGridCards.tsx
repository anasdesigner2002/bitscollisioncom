"use client";

import { useState } from "react";
import type { Article } from "@/app/lib/blog";

// "hover zoom" here is nimo-core.js's "blog-1-hover-active-class": the
// hovered card grows wider than its siblings, darkens with an overlay, and
// reveals the eye icon - see `.nm-blog-1-item:is(.active)` in
// nimo-core.css. The first card is active by default (matches the theme).
export default function PostGridCards({ posts }: { posts: Article[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="nm-blog-1-wrap">
      {posts.map((post, i) => (
        <div
          className={`nm-blog-1-item wa_magnetic_btn_2 ${i === active ? "active" : ""}`}
          key={post.id}
          onMouseEnter={() => setActive(i)}
        >
          <div className="item-img wa-p-relative wa-fix wa-img-cover">
            {post.image && <img src={post.image} alt={post.title} loading="lazy" />}
            {/* The theme's eye badge is `scale(0)` unless its card is the
                active one, so as a link it was unclickable on two cards out
                of three. It's decoration now - the whole card is the link
                (see `.nm-blog-1-item .card-link` in globals.css). */}
            <span className="card-btn">
              <span className="wa_magnetic_btn_2_elm d-block">
                <i className="flaticon-eye flaticon" />
              </span>
            </span>
            {post.category && (
              <div className="card-categories">
                <span className="link-elm nm-h-1">{post.category}</span>
              </div>
            )}
          </div>
          <div className="content">
            {post.date && <p className="nm-p-1 item-date">{post.date}</p>}
            <h4 className="nm-h-1 item-title">{post.title}</h4>
            {post.excerpt && <p className="nm-p-1 item-disc">{post.excerpt}</p>}
          </div>
          <a className="card-link" href={post.href} aria-label={post.title} />
        </div>
      ))}
    </div>
  );
}
