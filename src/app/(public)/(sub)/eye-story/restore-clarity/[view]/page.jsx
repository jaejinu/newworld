import ViewDetail from '@/components/board/view/ViewDetail';

export default async function RestoreClarityView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="restore-clarity" viewSlug={decodeURIComponent(view)} />;
}
