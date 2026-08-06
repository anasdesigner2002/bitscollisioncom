// Ports `nimo_breadcrumb()` (inc/layouts/nimo-breadcrumb.php) - a theme-level
// banner hooked onto `nimo_before_main_content`, prepended before every
// non-front page's Elementor content. It's not an Elementor widget, so it
// never showed up in any page's extracted `_elementor_data` tree; each page
// route renders it directly with its own title/breadcrumb trail.
export default function PageBreadcrumb({ title, current }: { title: string; current: string }) {
  return (
    // The band's artwork is drawn, not photographed - the stock portrait it
    // used to carry said nothing about the work, and at 1000px wide it was
    // being stretched across a 1920px band. It's assembled from background
    // layers in globals.css (`.nm-breadcrumb-area.tx-breadcrumb`) rather than
    // set here, so nothing about it can crop as the viewport changes.
    // `wa-bg-default` is dropped with it: that's the theme's `cover` rule,
    // which is exactly what those layers replace.
    <div className="nm-breadcrumb-area wa-p-relative tx-breadcrumb">
      <div className="container nm-header-1-container">
        <div className="nm-breadcrumb-wrap">
          <h1 className="nm-breadcrumb-title">{title}</h1>
          <div className="nm-breadcrumb-list">
            <a href="/">Home</a>
            <span>{current}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
