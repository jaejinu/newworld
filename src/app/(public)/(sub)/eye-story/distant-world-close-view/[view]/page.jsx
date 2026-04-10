import ViewDetail from '@/components/board/view/ViewDetail';

export default async function DistantWorldCloseViewView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="distant-world-close-view" viewSlug={decodeURIComponent(view)} />;
}
