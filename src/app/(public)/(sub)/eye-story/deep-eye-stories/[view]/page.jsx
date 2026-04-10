import ViewDetail from '@/components/board/view/ViewDetail';

export default async function DeepEyeStoriesView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="deep-eye-stories" viewSlug={decodeURIComponent(view)} />;
}
