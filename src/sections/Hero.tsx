// Первый экран. Координаты и стили — из оригинального макета Figma.
export default function Hero() {
  return (
    <g id={"Hero"} data-section={"Hero"} aria-label={"Первый экран"}>
      <rect y={"73"} width={"1440"} height={"628"} fill={"#FCFDFF"} />
      <mask id={"mask9_230_21"} style={{"maskType": "alpha"}} maskUnits={"userSpaceOnUse"} x={"0"} y={"73"} width={"1440"} height={"628"}>
        <rect y={"73"} width={"1440"} height={"628"} fill={"#FFF5F0"} />
      </mask>
      <g mask={"url(#mask9_230_21)"}>
        <rect x={"598"} y={"138"} width={"928"} height={"618"} fill={"url(#pattern26_230_21)"} />
        <rect width={"928"} height={"618"} transform={"matrix(1.19249e-08 -1 -1 -1.19249e-08 578 835)"} fill={"url(#pattern27_230_21)"} />
        <g filter={"url(#filter31_f_230_21)"}>
          <ellipse cx={"644.5"} cy={"483.5"} rx={"393.5"} ry={"275.5"} fill={"white"} />
        </g>
      </g>
      <g filter={"url(#filter32_f_230_21)"}>
        <ellipse cx={"713.5"} cy={"383.5"} rx={"393.5"} ry={"275.5"} fill={"white"} />
      </g>
      <rect x={"364"} y={"450"} width={"375"} height={"63.7898"} rx={"31.8949"} fill={"#FF5800"} />
      <text fill={"white"} style={{"whiteSpace": "pre"}} xmlSpace={"preserve"} fontFamily={"Onest"} fontSize={"20"} letterSpacing={"0.02em"}><tspan x={"465.264"} y={"488.21"}>{"Собрать фудбокс"}</tspan></text>
      <text fill={"#7C7C7C"} style={{"whiteSpace": "pre"}} xmlSpace={"preserve"} fontFamily={"Onest"} fontSize={"28.3168"} fontWeight={"300"} letterSpacing={"0em"}><tspan x={"439.514"} y={"393.415"}>{"ФУДБОКСЫ • КОРПОРАТИВЫ • ФУРШЕТЫ"}</tspan></text>
      <text fill={"#5A5A5A"} style={{"whiteSpace": "pre"}} xmlSpace={"preserve"} fontFamily={"Manrope"} fontSize={"82.2265"} fontWeight={"800"} letterSpacing={"0.07em"}><tspan x={"358.915"} y={"336.493"}>{"ВКУСНЫЙ СЛЕД"}</tspan></text>
      <text fill={"#5F5F5F"} style={{"whiteSpace": "pre"}} xmlSpace={"preserve"} fontFamily={"Onest"} fontSize={"20"} letterSpacing={"0.02em"}><tspan x={"812.773"} y={"488.713"}>{"Смотреть готовые"}</tspan><tspan x={"1035.2"} y={"488.713"}>{"→"}</tspan></text>
      <text fill={"#5F5F5F"} style={{"whiteSpace": "pre"}} xmlSpace={"preserve"} fontFamily={"Onest"} fontSize={"20"} letterSpacing={"1.74em"}><tspan x={"995.013"} y={"488.713"}>{" "}</tspan></text>
      <a href={"?page=constructor"} aria-label={"Собрать фудбокс"} className={"nav-link"}><rect x={364} y={450} width={375} height={64} fill={"transparent"} pointerEvents={"all"} /></a>
      <a href={"?page=boxes"} aria-label={"Смотреть готовые"} className={"nav-link"}><rect x={780} y={450} width={280} height={50} fill={"transparent"} pointerEvents={"all"} /></a>
    </g>
  );
}
