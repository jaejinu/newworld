import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from "@/components/main/heroSection/HeroSection";
import EditorPickSection from "@/components/main/editorPickSection/EditorPickSection";
import MidBannerSection from "@/components/main/midBannerSection/midBannerSection";
import LatestPostSection from "@/components/main/latestPostSection/LatestPostSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HeroSection />
        <EditorPickSection />
        <MidBannerSection />
        <LatestPostSection />
      </main>
    </div>
  );
}
