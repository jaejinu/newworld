import styles from './page.module.css';
import SubTop from "@/components/subTop/subTop";

export default function SubLayout({ children }) {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <SubTop />
                {children}
            </main>
        </div>
    );
}