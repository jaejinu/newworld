import ViewDetail from '@/components/board/view/ViewDetail';

export default async function GlassesFreeTechView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="glasses-free-tech" viewSlug={decodeURIComponent(view)} />;
}
