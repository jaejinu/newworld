import ViewDetail from '@/components/board/view/ViewDetail';

export default async function MedicalTeamStoriesView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="medical-team-stories" viewSlug={decodeURIComponent(view)} />;
}
