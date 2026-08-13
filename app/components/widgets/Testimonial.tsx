"use client";

import SplitTitle from "@/app/components/shared/SplitTitle";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import PrimaryButton from "@/app/components/shared/PrimaryButton";
import { on, type Settings } from "@/app/lib/types";

// The avatar "preview slider" is not a Swiper despite the markup/classes: the
// avatars are absolutely positioned on a circle and the ring is rotated as the
// section scrolls. Only the quote panel below is a real Swiper.
export default function Testimonial({ settings }: { settings: Settings }) {
  const list: any[] = settings.testimonial_lists || [];
  const [active, setActive] = useState(0);
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const counterRotateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section) return;
    const slides = Array.from(wrapper.children) as HTMLElement[];
    const radius = 450;
    const centerX = wrapper.clientWidth / 2;
    const centerY = wrapper.clientHeight / 2;
    const angleStep = (2 * Math.PI) / slides.length;

    slides.forEach((slide, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle) - slide.clientWidth / 2;
      const y = centerY + radius * Math.sin(angle) - slide.clientHeight / 2;
      slide.style.left = `${x}px`;
      slide.style.top = `${y}px`;
    });

    // Rotating the wrapper spins its children too, so each avatar is
    // counter-rotated to stay upright while the ring itself turns.
    function counterRotate() {
      const rotation = (gsap.getProperty(wrapper!, "rotation") as number) || 0;
      gsap.set(slides, { rotation: -rotation });
    }
    counterRotateRef.current = counterRotate;

    gsap.registerPlugin(ScrollTrigger);

    // Feel of the turn: scroll the pin absorbs (in viewport heights), seconds
    // the rotation takes to catch up to the scroll, and how much scrolling
    // before the lock the ring starts turning on.
    const PIN_VH = 1.6;
    const SCRUB_LAG = 0.5;
    const LEAD_PX = 320;

    // Pinning is desktop-only: below 992px the section is taller than the
    // viewport, so pinning would park part of it permanently off-screen.
    const mm = gsap.matchMedia();

    function turn(vars: ScrollTrigger.Vars) {
      const tween = gsap.fromTo(
        wrapper!,
        { rotation: 40 },
        { rotation: -40, ease: "none", onUpdate: counterRotate, scrollTrigger: vars },
      );
      counterRotate();
      return tween;
    }

    function spinUnpinned() {
      const tween = turn({ trigger: wrapper!, toggleActions: "play none none reverse", scrub: true });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }

    function spinPinned() {
      // Two triggers, not one: the pin animates nothing, and the rotation spans
      // LEAD_PX *before* the lock through to the pin's end. That keeps the ring
      // already turning at its pinned speed when the page stops - pinning a
      // motionless ring made the lock feel like a wall. The rotation reads
      // start/end off the pin so the ranges stay welded across a refresh, and
      // refreshPriority makes the pin recalculate first so those reads are
      // never stale.
      const pin = ScrollTrigger.create({
        trigger: section!,
        start: () => (section!.offsetHeight < window.innerHeight ? "center center" : "top top"),
        end: () => `+=${window.innerHeight * PIN_VH}`,
        pin: true,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      const tween = turn({
        trigger: section!,
        start: () => pin.start - LEAD_PX,
        end: () => pin.end,
        scrub: SCRUB_LAG,
        invalidateOnRefresh: true,
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        pin.kill();
      };
    }

    mm.add("(min-width: 992px)", spinPinned);
    mm.add("(max-width: 991px)", spinUnpinned);

    return () => {
      counterRotateRef.current = null;
      mm.revert();
    };
  }, [list.length]);

  function selectAvatar(i: number) {
    if (draggedRef.current) return;
    setActive(i);
    mainSwiperRef.current?.slideTo(i);
  }

  // Drag-to-rotate engages only after a long press, since a plain click has to
  // still select the avatar. A distance threshold alone misfired on ordinary
  // clicks, where hand jitter between pointerdown and pointerup exceeded it.
  const LONG_PRESS_MS = 350;
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const longPressActive = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedRef = useRef(false);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    draggedRef.current = false;
    longPressActive.current = false;
    dragStartX.current = e.clientX;
    dragStartRotation.current = (gsap.getProperty(wrapper, "rotation") as number) || 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    longPressTimer.current = setTimeout(() => {
      longPressActive.current = true;
    }, LONG_PRESS_MS);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!longPressActive.current) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 3) draggedRef.current = true;
    gsap.set(wrapper, { rotation: dragStartRotation.current + delta / 4 });
    counterRotateRef.current?.();
  }

  function onPointerUp() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressActive.current = false;
    // Cleared on a delay so the click handler on the avatar just released
    // under the pointer still sees `draggedRef` true and skips selection.
    setTimeout(() => {
      draggedRef.current = false;
    }, 0);
  }

  return (
    <section ref={sectionRef} className="nm-testimonial-1-area pt-65 wa-fix wa-p-relative tx-section">
      <div className="container nm-container-1">
        <div className="nm-testimonial-1-sec-title">
          <div className="left">
            {on(settings.enable_sub_title) && (
              <h6 className="nm-subtitle-1">
                <span className="dot" />
                <span className="text" dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
              </h6>
            )}
            {on(settings.enable_title) && (
              <SplitTitle as="h2" className="tx-title nm-sec-title-1" html={settings.title} />
            )}
          </div>
          <div className="right">
            {on(settings.enable_description) && (
              <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
            )}
            {on(settings.enable_button) && (
              <PrimaryButton text={settings.button_text} link={settings.button_link} icon={settings.button_icon} />
            )}
          </div>
        </div>

        <div
          className="nm-testimonial-1-wrap wa-p-relative wa-bg-default"
          style={settings.image_1?.url ? { backgroundImage: `url(${settings.image_1.url})` } : undefined}
        >
          <div className="nm-testimonial-1-preview">
            <div
              className="nm-testimonial-1-preview-slider"
              style={{ cursor: "grab", touchAction: "pan-y" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="swiper-wrapper" ref={wrapperRef}>
                {list.map((item, i) => (
                  <div
                    className={`swiper-slide ${i === active ? "swiper-slide-thumb-active" : ""}`}
                    key={item._id || i}
                    onClick={() => selectAvatar(i)}
                  >
                    {item.author_image?.url && (
                      <div className="nm-testimonial-1-preview-slider-item wa-fix wa-img-cover">
                        <img src={item.author_image.url} alt={item.name || ""} loading="lazy" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nm-testimonial-1-main-slider wa-fix">
            <Swiper
              modules={[EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              slidesPerView={1}
              allowTouchMove={false}
              onSwiper={(s) => (mainSwiperRef.current = s)}
              onSlideChange={(s) => setActive(s.activeIndex)}
            >
              {list.map((item, i) => (
                <SwiperSlide key={item._id || i}>
                  <div className="nm-testimonial-1-main-slider-single">
                    {item.quote_icon?.value && (
                      <div className="icon">
                        <ElementorIcon icon={item.quote_icon} />
                      </div>
                    )}
                    {item.comment && <p className="nm-p-1 comment" dangerouslySetInnerHTML={{ __html: item.comment }} />}
                    <div className="line" />
                    {on(item.enable_rating) && (
                      <div className="nm-choose-1-rating">
                        <div className="rating-icon">
                          {Array.from({ length: 5 }, (_, s) => (
                            <i
                              key={s}
                              className={s < Number(item.rating_star) ? "fa-solid fa-star" : "fa-regular fa-star-half-stroke"}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="nm-p-1 author-name">
                      {item.name} {item.designation}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="nm-testimonial-1-bg-blur" />
    </section>
  );
}
