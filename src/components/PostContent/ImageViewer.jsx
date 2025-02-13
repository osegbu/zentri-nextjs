"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./imageViewer.module.css";

const ImageViewer = ({ images, activeImageIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(activeImageIndex);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  return (
    <section className={styles.viewerBackdrop}>
      <section
        className={styles.viewerContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.SVG}>
            <g>
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
            </g>
          </svg>
        </button>
        <section className={styles.imageWrapper}>
          <Image
            loader={customLoader}
            src={images[currentIndex]}
            alt="Post Image"
            width={800}
            height={600}
            className={styles.image}
            priority
          />
        </section>
        <div className={styles.navigation}>
          {currentIndex > 0 && (
            <button className={styles.prevBtn} onClick={handlePrev}>
              «
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button className={styles.nextBtn} onClick={handleNext}>
              »
            </button>
          )}
        </div>
      </section>
    </section>
  );
};

export default ImageViewer;
