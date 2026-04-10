import ViewDetail from '@/components/board/view/ViewDetail';

export default async function CenterNewsView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="center-news" viewSlug={decodeURIComponent(view)} />;
}
