import ViewDetail from '@/components/board/view/ViewDetail';

export default async function MemberStoriesView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="member-stories" viewSlug={decodeURIComponent(view)} />;
}
