import { CanvasApp } from "../../../components/CanvasApp";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <CanvasApp slug={slug} />;
}
