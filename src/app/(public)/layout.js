import Header from "@/components/layout/header/Header";
import TopBanner from "@/components/topBanner/TopBanner";
import Footer from "@/components/layout/footer/Footer";
import ScrollClassEffect from "@/components/ScrollClassEffect";

export default function PublicLayout({ children }) {
  return (
    <>
      <ScrollClassEffect />
      <Header />
      {children}
      <Footer />
    </>
  );
}
