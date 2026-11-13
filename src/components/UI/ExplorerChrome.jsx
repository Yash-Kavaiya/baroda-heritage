import { ArrowUpRight } from "lucide-react";

export default function HeroIntro({ onExplore, count }) {
  return (
    <div className="hero-editorial">
      <div className="eyebrow">OLD SOUL. NEW PERSPECTIVE.</div>
      <h1 aria-label="Vadodara, in a new dimension.">
        <span>Vadodara,</span>
        <span>in a new</span>
        <em>dimension.</em>
      </h1>
      <p className="hero-description">
        Some places deserve more than a photograph. Get a little closer to the
        stories, spaces and soul of Gujarat’s cultural capital.
      </p>
      <button className="primary-action" onClick={onExplore}>
        Let’s explore <ArrowUpRight size={19} />
      </button>
      <div className="hero-footnote">
        {count} landmarks. Endless perspectives.
      </div>
    </div>
  );
}
