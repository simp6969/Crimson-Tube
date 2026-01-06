"use client";

import { useState } from "react";

export default function LandingPage() {
  const [pageState, setPageState] = useState({
    videoUrl: "",
    fileFormat: "MP4",
    isLoading: false,
    error: null,
  });

  async function handleDownload() {
    if (!pageState.videoUrl.trim()) {
      alert("Please enter a YouTube video URL.");
      return;
    }

    // Set loading state and clear previous errors
    setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: pageState.videoUrl }),
      });

      // If the server responds with an error (like 400 or 500)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "An unknown error occurred"
        );
      }

      // Get filename from the 'Content-Disposition' header
      const disposition = response.headers.get("Content-Disposition");
      let filename = "download.mp4";
      if (disposition && disposition.includes("attachment")) {
        const filenameMatch = /filename="([^"]+)"/.exec(disposition);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setPageState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  }

  function handleFileFormatChange(format) {
    setPageState((prev) => ({ ...prev, fileFormat: format }));
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
  return (
    <div className="flex justify-center items-center h-[100dvh] w-[100dvw] flex-col gap-4 ">
      <h1>Crimson Tube</h1>
      <div className="flex flex-wrap gap-[10px] justify-center items-center">
        <div className="w-[410px] h-[50px] flex flex-row bg-[var(--color-base-200)] gap-[5px] rounded-[5px]">
          <input
            autoComplete="off"
            spellCheck="false"
            onChange={(e) =>
              setPageState((prev) => ({
                ...prev,
                videoUrl: e.target.value,
                error: null,
              }))
            }
            type="text"
            placeholder="Enter YouTube video URL"
            className="w-[350px] h-[50px] p-[25px] bg-[var(--color-base-200)] rounded-[5px]"
            name="url fetching input"
          />
          <button
            className="goButton"
            onClick={handleDownload}
            disabled={pageState.isLoading}
          >
            {pageState.isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <svg
                fill="var(--secondary-color)"
                height={35}
                width={35}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
              >
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
              </svg>
            )}
          </button>
        </div>
        <div className="dropdown dropdown-hover ">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-neutral bg-[var(--color-base-200)] p-[22px] border-0 text-[16px]"
          >
            {pageState.fileFormat}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-[var(--color-base-200)] rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li
              onClick={() => {
                handleFileFormatChange("MP4");
              }}
            >
              <a>MP4</a>
            </li>
            <li
              onClick={() => {
                handleFileFormatChange("MP3");
              }}
            >
              <a>MP3</a>
            </li>
          </ul>
        </div>
      </div>
      {pageState.error && (
        <div
          role="alert"
          className="absolute top-5 alert alert-error mt-4 w-full max-w-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {pageState.error}</span>
        </div>
      )}
    </div>
  );
}