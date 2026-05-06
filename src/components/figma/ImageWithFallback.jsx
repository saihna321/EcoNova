import { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyIgc3Ryb2tlPSIjMDBGRjg4IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

export function ImageWithFallback(props) {
  const { src, alt = "", style, className = "", onError, onLoad, ...rest } = props;
  const [imageState, setImageState] = useState({
    src,
    status: src ? "loading" : "error",
  });
  const status = imageState.src === src ? imageState.status : src ? "loading" : "error";

  const handleLoad = (event) => {
    setImageState({ src, status: "loaded" });
    onLoad?.(event);
  };

  const handleError = (event) => {
    setImageState({ src, status: "error" });
    onError?.(event);
  };

  if (status === "error") {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} unavailable` : "Image unavailable"}
        className={`flex items-center justify-center bg-[#18181b] text-center align-middle ${className}`}
        style={style}
      >
        <img src={ERROR_IMG_SRC} alt="" className="h-10 w-10 opacity-60" data-original-url={src} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#18181b] ${className}`} style={style}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-[#27272a]" />
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
        loading={rest.loading ?? "lazy"}
        decoding={rest.decoding ?? "async"}
        {...rest}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
