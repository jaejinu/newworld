import PostList from '@/components/board/postList/postList';
import styles from './EditorPickSection.module.css';
import Link from 'next/link';
export default function EditorPickSection() {
  return (
    <section className={styles.editorPickSection}>
        <div className="section-inner">
            <div className="section-head">
                <div className="section-left">
                    <span className="flag-type blue">놓치지 말아야 할 에디터 Pick! ✍️</span>
                </div>
                <Link href="/search?type=editorPick" className="text-link">
                    <div>View More</div>
                </Link>
                <div className="line"></div>
            </div>
            <PostList type="column" itemType="editorPick" number={3} hasDesc={false} />
        </div>
    </section>
  );
}