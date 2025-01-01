import Svg, { Circle, Rect, SvgProps, Path } from "react-native-svg";

export const DarkTheme = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke="#F7ECC9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.03 12.42c.36 5.15 4.73 9.34 9.96 9.57 3.69.16 6.99-1.56 8.97-4.27.82-1.11.38-1.85-.99-1.6-.67.12-1.36.17-2.08.14C13 16.06 9 11.97 8.98 7.14c-.01-1.3.26-2.53.75-3.65.54-1.24-.11-1.83-1.36-1.3C4.41 3.86 1.7 7.85 2.03 12.42Z"
      />
    </Svg>
  );
};

export const LightTheme = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke="#F7ECC9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"
      />
      <Path
        stroke="#F7ECC9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m19.14 19.14-.13-.13m0-14.02.13-.13-.13.13ZM4.86 19.14l.13-.13-.13.13ZM12 2.08V2v.08ZM12 22v-.08.08ZM2.08 12H2h.08ZM22 12h-.08.08ZM4.99 4.99l-.13-.13.13.13Z"
      />
    </Svg>
  );
};

export const Exchange = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m5 17 3 3 3-3M13 7l3-3 3 3"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={2}
        d="M16 6v6M8 12v6"
      />
    </Svg>
  );
};

export const GenerateVoice = (props: SvgProps) => {
  return (
    <Svg width={22} height={20} fill="none" {...props}>
      <Path
        fill="#292D32"
        fillRule="evenodd"
        d="M11 1.7c-1.944 0-3.497 1.63-3.5 3.599v4.108c0 1.96 1.558 3.576 3.5 3.576h.343c1.942 0 3.5-1.616 3.5-3.576V5.305c0-1.972-1.554-3.605-3.5-3.605H11ZM9.357 9.64V5.072c.11-.852.824-1.493 1.643-1.493h.343c.819 0 1.533.64 1.643 1.493V9.64c-.111.83-.82 1.464-1.643 1.464H11c-.823 0-1.532-.633-1.643-1.464Z"
        clipRule="evenodd"
      />
      <Path
        fill="#292D32"
        d="M5.629 10.292a.934.934 0 0 0-.929.94c0 1.533.86 2.881 2.003 3.855.924.787 2.073.971 3.214 1.155l.354.058v1.521H7.457a.934.934 0 0 0-.928.94c0 .506.404.939.928.939h7.486a.934.934 0 0 0 .928-.94.934.934 0 0 0-.928-.939h-2.814V16.3l.354-.058c1.141-.184 2.29-.368 3.214-1.155 1.143-.974 2.003-2.322 2.003-3.856a.934.934 0 0 0-.929-.94.934.934 0 0 0-.928.94c0 .96-.591 1.892-1.52 2.606-.87.67-1.965.666-2.937.663h-.372c-.972.003-2.067.006-2.937-.663-.93-.714-1.52-1.645-1.52-2.606a.934.934 0 0 0-.928-.94ZM18.51.385c.125-.513.855-.513.98 0l.342 1.412a.504.504 0 0 0 .37.371l1.413.343c.513.124.513.854 0 .978l-1.412.343a.504.504 0 0 0-.371.37l-.343 1.413c-.124.513-.854.513-.979 0l-.342-1.412a.504.504 0 0 0-.37-.371l-1.413-.343a.553.553 0 0 1-.09-.03c-.421-.183-.391-.832.09-.948l1.412-.343a.504.504 0 0 0 .371-.37l.343-1.413ZM2.092 15.32c.104-.427.712-.427.816 0l.285 1.178a.42.42 0 0 0 .31.309l1.176.285c.428.104.428.712 0 .816l-1.177.285a.416.416 0 0 0-.309.31l-.285 1.176a.46.46 0 0 1-.025.075c-.153.351-.694.326-.79-.075l-.286-1.177a.419.419 0 0 0-.31-.309l-1.176-.285a.46.46 0 0 1-.075-.025c-.351-.153-.326-.694.075-.79l1.177-.286a.42.42 0 0 0 .309-.31l.285-1.176ZM6 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM21 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM21 15a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM3 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      />
    </Svg>
  );
};

export const History = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M14.55 21.67C18.84 20.54 22 16.64 22 12c0-5.52-4.44-10-10-10C5.33 2 2 7.56 2 7.56m0 0V3m0 4.56H6.44"
      />
      <Path
        stroke="#fff"
        strokeDasharray="3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2 12c0 5.52 4.48 10 10 10"
      />
    </Svg>
  );
};

export const BottomArrow = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      />
    </Svg>
  );
};

export const Delete = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke="#F7ECC9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.28 20.25H17c2.76 0 5-2.24 5-5v-6.5c0-2.76-2.24-5-5-5h-6.72c-1.41 0-2.75.59-3.7 1.64L3.05 9.27a4.053 4.053 0 0 0 0 5.46l3.53 3.88a4.978 4.978 0 0 0 3.7 1.64Z"
      />
      <Path
        stroke="#F7ECC9"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="m16 14.47-4.94-4.94M11.06 14.47 16 9.53"
      />
    </Svg>
  );
};

export const Settings = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        stroke={props.color ? props.color : "#F7ECC9"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
      <Path
        stroke={props.color ? props.color : "#F7ECC9"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z"
      />
    </Svg>
  );
};

export const Search = () => {
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke={"#000"}
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.3-4.3" />
    </Svg>
  );
};
