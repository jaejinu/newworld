import ViewDetail from '@/components/board/view/ViewDetail';

export default async function SilentVisionThiefView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="silent-vision-thief" viewSlug={decodeURIComponent(view)} />;
}
