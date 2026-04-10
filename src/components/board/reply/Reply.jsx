 'use client';

import { useMemo, useState } from 'react';
import styles from './Reply.module.css';
import { replyDummy } from '@/lib/constants/replyDummy';

function formatKoreanDate(isoLike) {
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function makeId() {
  return `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function Reply() {
  const [comments, setComments] = useState(replyDummy);
  const [replyTo, setReplyTo] = useState(null); // { parentId, parentAuthor }

  const [form, setForm] = useState({
    author: '',
    email: '',
    phone: '',
    consent: true,
    content: '',
  });

  const totalCount = useMemo(() => {
    const childCount = comments.reduce((acc, c) => acc + (c.children?.length ?? 0), 0);
    return comments.length + childCount;
  }, [comments]);

  const handleChange = (key) => (e) => {
    const value = key === 'consent' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReplyClick = (parentId, parentAuthor) => () => {
    setReplyTo({ parentId, parentAuthor });
  };

  const handleCancelReply = () => setReplyTo(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const author = form.author.trim();
    const email = form.email.trim();
    const content = form.content.trim();

    if (!author || !email || !content) return;

    const newComment = {
      id: makeId(),
      author,
      date: new Date().toISOString(),
      content,
    };

    setComments((prev) => {
      if (!replyTo?.parentId) {
        return [...prev, { ...newComment, children: [] }];
      }

      return prev.map((c) => {
        if (c.id !== replyTo.parentId) return c;
        const nextChildren = [...(c.children ?? []), newComment];
        return { ...c, children: nextChildren };
      });
    });

    setForm((prev) => ({ ...prev, content: '' }));
    setReplyTo(null);
  };


  return (
    <div id="reply-area" className={styles.replyArea}>
      <h2 className={styles.replyTitle}>
        {totalCount === 0 ? '댓글이 없습니다.' : `${totalCount}개의 댓글이 있습니다.`}
      </h2>

      {comments.length > 0 ? (
        <div className={styles.replyList}>
          {comments.map((comment) => (
            <div className={styles.replyItem} key={comment.id}>
              <div className={styles.replyMain}>
                <div className={styles.replyInfo}>
                  <p className={styles.userId}>{comment.author}</p>
                  <span className={styles.date}>{formatKoreanDate(comment.date)}</span>
                </div>
                <div className={styles.replyContent}>
                  <p>{comment.content}</p>
                </div>
                <div className={styles.replyMore}>
                  <button
                    type="button"
                    className={styles.replyButton}                    
                    onClick={handleReplyClick(comment.id, comment.author)}
                  >
                    답글달기
                  </button>
                </div>
              </div>

              {(comment.children?.length ?? 0) > 0 && (
                <div className={styles.replySubList}>
                  {comment.children.map((child) => (
                    <div className={styles.replySub} key={child.id}>
                      <div className={styles.replyInfo}>
                        <p className={styles.userId}>{child.author}</p>
                        <span className={styles.date}>{formatKoreanDate(child.date)}</span>
                      </div>
                      <div className={styles.replyContent}>
                        <p>{child.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`${styles.replyList} ${styles.replyListEmpty}`}>
          <p className={styles.noComments}>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요.</p>
        </div>
      )}

      <h2 className={styles.replyTitle}>댓글을 남겨주세요</h2>

      {replyTo && (
        <div className={styles.replyInfoDisplay}>
          <p>{replyTo.parentAuthor}님께 답글 작성 중</p>
          <button type="button" className={styles.cancelReplyBtn} onClick={handleCancelReply}>
            취소
          </button>
        </div>
      )}

      <form className={styles.replyApply} onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <input
            className={styles.input}
            type="text"
            name="author"
            placeholder="이름을 입력해주세요 *"
            value={form.author}            
            onChange={handleChange('author')}
            required
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요 *"
            value={form.email}            
            onChange={handleChange('email')}
            required
          />
          <input
            className={styles.input}
            type="tel"
            name="phone"
            placeholder="연락처를 입력해주세요"
            value={form.phone}            
            onChange={handleChange('phone')}
            maxLength={13}
          />
        </div>

        <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agree"
              name="comment_cookies_consent"
              checked={form.consent}
              onChange={handleChange('consent')}
            />
            <label htmlFor="agree">다음 댓글 작성을 위해 이름, 이메일, 웹사이트를 이 브라우저에 저장합니다.</label>
        </div>

        <textarea
          className={styles.textarea}
          name="content"
          placeholder="댓글을 입력해주세요 *"
          value={form.content}          
          onChange={handleChange('content')}
          required
        />

        <div className={styles.btnGroup}>
          <button type="submit" className={`${styles.submitBtn} submit btn`}>
            보내기
          </button>
        </div>
      </form>
    </div>
  );
}