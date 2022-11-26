import * as React from "react"

const GameFieldBackgroundSVG = (props) => (
  <svg
    data-name="Ebene 1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 842.09 473.97"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1={420.95}
        y1={378.57}
        x2={420.95}
        y2={467.34}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#1d1d1b" stopOpacity={0} />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="b"
        x1={259.77}
        y1={799.19}
        x2={259.77}
        y2={845.31}
        gradientTransform="matrix(1 0 0 -1 161.18 848.71)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.41} stopColor="#1d1d1b" stopOpacity={0} />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="c"
        x1={160.18}
        y1={236.78}
        x2={680.49}
        y2={236.78}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.02} stopColor="#1d1d1b" />
        <stop offset={0.04} stopColor="#1d1d1b" stopOpacity={0.86} />
        <stop offset={0.15} stopColor="#1d1d1b" stopOpacity={0.37} />
        <stop offset={0.28} stopColor="#1d1d1b" stopOpacity={0.09} />
        <stop offset={0.51} stopColor="#1d1d1b" stopOpacity={0} />
        <stop offset={1} />
      </linearGradient>
    </defs>
    <image
      width={3000}
      height={1688}
      transform="matrix(.28 0 0 .28 0 .16)"
      xlinkHref="../backgrounds/BG4.png"
    />
    <image
      width={3508}
      height={1973}
      transform="translate(.17) scale(.24)"
      xlinkHref="../backgrounds/BG2.png"
    />
    <image
      width={5011}
      height={2819}
      transform="translate(.17) scale(.17)"
      xlinkHref="../backgrounds/BG3.png"
    />
    <image
      width={3508}
      height={1973}
      transform="matrix(.24 0 0 .24 .17 .16)"
      xlinkHref="../backgrounds/BG1.png"
    />
    <path
      style={{
        fill: "url(#a)",
      }}
      d="M161.08 373.16h519.73v100.4H161.08z"
    />
    <path
      style={{
        fill: "url(#b)",
      }}
      d="M161.08.16h519.73v52.18H161.08z"
    />
    <path
      style={{
        fill: "url(#c)",
      }}
      d="M161.08 0h520.31v473.56H161.08z"
    />
    <path
      style={{
        fill: "none",
      }}
      d="m386.52 252.78 4.14-.01"
    />
    <path
      transform="rotate(-89.79 339.953 130.648)"
      style={{
        fill: "#fff",
        stroke: "#fff",
        strokeWidth: ".25px",
        strokeMiterlimit: 10,
      }}
      d="M259.52 7.04h.5v409.73h-.5z"
    />
  </svg>
)

export default GameFieldBackgroundSVG
